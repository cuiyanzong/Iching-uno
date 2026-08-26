# 六十四卦 UNO 游戏 - 功能实现详解

## 目录

1. [游戏引擎系统](#游戏引擎系统)
2. [积分系统](#积分系统)
3. [排行榜系统](#排行榜系统)
4. [音频系统](#音频系统)
5. [AI系统](#ai系统)
6. [数据存储](#数据存储)
7. [调试工具](#调试工具)
8. [API接口](#api接口)

---

## 游戏引擎系统

### 核心文件
- `client/src/lib/gameEngine.ts` - 游戏引擎核心逻辑
- `client/src/hooks/useLocalGameState.ts` - 游戏状态管理
- `client/src/pages/LocalGame.tsx` - 游戏主页面

### 实现原理

#### 1. 游戏状态管理
```typescript
// 游戏状态结构
interface GameState {
  id: number;
  players: Player[];
  currentPlayer: number;
  deck: string[];
  discardPile: string[];
  currentCard: string | null;
  status: "waiting" | "playing" | "finished";
  round: number;
  scores: Record<number, number>;
  aiAssistant?: AIAssistantState;
}

// 状态更新机制
const updateGameState = (newState: Partial<GameState>) => {
  setGameState(prev => ({ ...prev, ...newState }));
  // 触发状态同步事件
  dispatchGameStateUpdate(newState);
};
```

#### 2. 游戏逻辑核心
```typescript
// 卡牌匹配逻辑
function canPlayCard(card: string, currentCard: string): boolean {
  const [cardElement, cardType] = card.split('_');
  const [currentElement, currentType] = currentCard.split('_');
  
  return cardElement === currentElement || cardType === currentType;
}

// 回合管理
function nextPlayer(gameState: GameState): number {
  const direction = gameState.direction === "clockwise" ? 1 : -1;
  return (gameState.currentPlayer + direction + gameState.players.length) % gameState.players.length;
}
```

#### 3. 游戏操作API
```typescript
// 出牌操作
const playCard = async (cardId: string) => {
  if (!canPlayCard(cardId, gameState.currentCard)) {
    throw new Error("无法出这张牌");
  }
  
  // 更新玩家手牌
  const newHand = gameState.players[gameState.currentPlayer].cards.filter(c => c !== cardId);
  
  // 更新游戏状态
  updateGameState({
    currentCard: cardId,
    discardPile: [...gameState.discardPile, cardId],
    players: gameState.players.map((p, i) => 
      i === gameState.currentPlayer ? { ...p, cards: newHand } : p
    )
  });
  
  // 检查获胜条件
  if (newHand.length === 0) {
    endGame(gameState.currentPlayer);
  }
};

// 抽牌操作
const drawCard = async () => {
  if (gameState.deck.length === 0) {
    reshuffleDeck();
  }
  
  const drawnCard = gameState.deck[0];
  const newDeck = gameState.deck.slice(1);
  
  updateGameState({
    deck: newDeck,
    players: gameState.players.map((p, i) => 
      i === gameState.currentPlayer 
        ? { ...p, cards: [...p.cards, drawnCard] }
        : p
    )
  });
};
```

### 调用方式
```typescript
// 初始化游戏
const initializeGame = async (playerName: string) => {
  const gameState = await gameEngine.createGame(playerName);
  setGameState(gameState);
};

// 处理玩家操作
const handlePlayerAction = async (action: 'play' | 'draw', cardId?: string) => {
  if (action === 'play' && cardId) {
    await playCard(cardId);
  } else if (action === 'draw') {
    await drawCard();
  }
};
```

---

## 积分系统

### 核心文件
- `client/src/utils/permanentScores.ts` - 积分系统核心
- `client/src/components/GameCompletionModal.tsx` - 积分结算界面

### 实现原理

#### 1. 积分数据结构
```typescript
interface PermanentScoreData {
  playerId: string;          // 玩家ID格式: "human_playerName"
  playerName: string;        // 显示名称
  totalScore: number;        // 总积分
  gamesPlayed: number;       // 游戏局数
  wins: number;              // 胜利次数
  defeats: number;           // 失败次数
  clearCards: number;        // 清牌次数
  achievements: {
    smallWins: number;       // 小胜次数 (+100分)
    doubleKills: number;     // 一箭双雕 (+200分)
    quadKills: number;       // 大杀四方 (+300分)
  };
  scoreHistory: ScoreHistoryEntry[];
  lastPlayed: number;        // 最后游戏时间戳
}
```

#### 2. 积分计算逻辑
```typescript
function calculatePermanentScoreChanges(gameState: GameState): PermanentScoreChange[] {
  const changes: PermanentScoreChange[] = [];
  const humanPlayer = gameState.players.find(p => !p.isAI);
  
  if (!humanPlayer) return changes;
  
  // 分析游戏结果
  const aiPlayers = gameState.players.filter(p => p.isAI);
  const winnerId = gameState.players.findIndex(p => p.cards.length === 0);
  
  let scoreChange = 0;
  let reason = "";
  
  if (winnerId === gameState.players.indexOf(humanPlayer)) {
    // 人类玩家获胜
    const aisWith0Cards = aiPlayers.filter(ai => ai.cards.length === 0).length;
    
    if (aisWith0Cards >= 3) {
      scoreChange = 300;
      reason = "大杀四方";
    } else if (aisWith0Cards >= 2) {
      scoreChange = 200;
      reason = "一箭双雕";
    } else {
      scoreChange = 100;
      reason = "小胜一局";
    }
  } else {
    // 人类玩家失败
    scoreChange = -100;
    reason = "游戏失败";
  }
  
  const currentScore = getCurrentPlayerScore(humanPlayer.name);
  const newScore = Math.max(0, currentScore + scoreChange);
  
  changes.push({
    playerId: `human_${humanPlayer.name}`,
    playerName: humanPlayer.name,
    oldScore: currentScore,
    newScore: newScore,
    change: scoreChange,
    reason: reason
  });
  
  return changes;
}
```

#### 3. 积分持久化
```typescript
// 应用积分变化
function applyPermanentScoreChanges(changes: PermanentScoreChange[]): void {
  const scores = getPermanentScores();
  
  changes.forEach(change => {
    const playerId = change.playerId;
    const currentData = scores[playerId] || createDefaultScoreData(change.playerName);
    
    // 更新积分数据
    const updatedData: PermanentScoreData = {
      ...currentData,
      totalScore: change.newScore,
      gamesPlayed: currentData.gamesPlayed + 1,
      wins: change.change > 0 ? currentData.wins + 1 : currentData.wins,
      defeats: change.change < 0 ? currentData.defeats + 1 : currentData.defeats,
      clearCards: currentData.clearCards + 1,
      achievements: updateAchievements(currentData.achievements, change.reason),
      scoreHistory: [
        ...currentData.scoreHistory,
        {
          timestamp: Date.now(),
          oldScore: change.oldScore,
          newScore: change.newScore,
          change: change.change,
          reason: change.reason,
          gameId: `game_${Date.now()}`
        }
      ],
      lastPlayed: Date.now()
    };
    
    scores[playerId] = updatedData;
  });
  
  // 保存到localStorage
  localStorage.setItem(PERMANENT_SCORES_KEY, JSON.stringify(scores));
}
```

### 调用方式
```typescript
// 获取积分数据
const scores = getPermanentScores();
const playerScore = scores[`human_${playerName}`];

// 计算积分变化
const changes = calculatePermanentScoreChanges(gameState);

// 应用积分变化
applyPermanentScoreChanges(changes);

// 获取玩家当前积分
const currentScore = getCurrentPlayerScore(playerName);
```

---

## 排行榜系统

### 核心文件
- `client/src/utils/autoUpload.ts` - 自动上传系统
- `client/src/utils/globalLeaderboard.ts` - 排行榜API
- `server/routes/leaderboard.ts` - 后端API

### 实现原理

#### 1. 自动上传机制
```typescript
// 自动上传触发
export async function tryAutoUploadPlayer(playerName: string): Promise<boolean> {
  try {
    // 1. 检查网络连接
    if (!isOnline() || !await testNetworkConnection()) {
      console.log(`📶 网络不可用，将 ${playerName} 添加到待上传队列`);
      addToPendingQueue(playerName);
      return false;
    }
    
    // 2. 获取本地积分数据
    const localData = getPermanentScores();
    const playerData = localData[`human_${playerName}`];
    
    if (!playerData) {
      console.log(`❌ 未找到 ${playerName} 的本地数据`);
      return false;
    }
    
    // 3. 转换为上传格式
    const uploadData = convertToUploadData(playerData);
    
    // 4. 尝试上传
    const success = await uploadToGlobalLeaderboard(uploadData);
    
    if (success) {
      console.log(`✅ ${playerName} 数据上传成功`);
      removeFromPendingQueue(playerName);
      return true;
    } else {
      console.log(`❌ 上传失败，添加到待上传队列`);
      addToPendingQueue(playerName, uploadData);
      return false;
    }
  } catch (error) {
    console.error(`上传 ${playerName} 数据时发生错误:`, error);
    return false;
  }
}
```

#### 2. 离线队列管理
```typescript
interface PendingUpload {
  playerName: string;
  data: LeaderboardUploadData;
  timestamp: number;
  attempts: number;
}

// 添加到待上传队列
function addToPendingQueue(playerName: string, data: LeaderboardUploadData): void {
  const uploads = getPendingUploads();
  const existingIndex = uploads.findIndex(upload => upload.playerName === playerName);
  
  const pendingUpload: PendingUpload = {
    playerName,
    data,
    timestamp: Date.now(),
    attempts: 0
  };
  
  if (existingIndex >= 0) {
    uploads[existingIndex] = pendingUpload;
  } else {
    uploads.push(pendingUpload);
  }
  
  savePendingUploads(uploads);
}

// 处理待上传队列
export async function processPendingUploads(): Promise<void> {
  const uploads = getPendingUploads();
  
  if (uploads.length === 0) return;
  
  const successfulUploads: string[] = [];
  const failedUploads: PendingUpload[] = [];
  
  for (const upload of uploads) {
    try {
      upload.attempts++;
      const success = await uploadToGlobalLeaderboard(upload.data);
      
      if (success) {
        successfulUploads.push(upload.playerName);
      } else if (upload.attempts < 5) {
        failedUploads.push(upload);
      }
    } catch (error) {
      if (upload.attempts < 5) {
        failedUploads.push(upload);
      }
    }
  }
  
  savePendingUploads(failedUploads);
}
```

#### 3. 排行榜API
```typescript
// 上传到全球排行榜
export async function uploadToGlobalLeaderboard(data: LeaderboardUploadData): Promise<boolean> {
  try {
    const { getDeviceId } = await import('./deviceId');
    
    // 检查云端是否已存在同名玩家
    const existingPlayer = await checkCloudPlayerName(data.playerName);
    
    if (existingPlayer) {
      // 更新现有玩家数据
      return await updateGlobalLeaderboard(data.playerName, data);
    } else {
      // 创建新玩家记录
      const uploadData = { ...data, deviceId: getDeviceId() };
      
      const response = await fetch('/api/leaderboard/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.success;
    }
  } catch (error) {
    console.error('上传到全球排行榜失败:', error);
    return false;
  }
}
```

### 调用方式
```typescript
// 在积分保存后触发自动上传
changes.forEach(change => {
  if (change.playerId.startsWith('human_')) {
    tryAutoUploadPlayer(change.playerName);
  }
});

// 手动同步所有玩家
forceSyncAllPlayers();

// 检查上传队列状态
checkUploadQueue();

// 获取全球排行榜
const leaderboard = await getGlobalLeaderboard();
```

---

## 音频系统

### 核心文件
- `client/src/lib/localAudio.ts` - 音频播放核心
- `client/src/components/VoiceSelector.tsx` - 音频控制组件
- `audioBase64.js` - 音频数据文件 (1.8MB)

### 实现原理

#### 1. 音频数据结构
```typescript
// audioBase64.js 中的数据结构
const audioMap = {
  "sky_wind_xiaoxu": {
    "yunxi": "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEA...",
    "xiaoyi": "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEA..."
  },
  // ... 128张卡牌的音频数据
};
```

#### 2. 音频播放系统
```typescript
// 音频播放核心类
class LocalAudioPlayer {
  private volume: number = 0.7;
  private voiceType: 'yunxi' | 'xiaoyi' = 'yunxi';
  private isMuted: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;
  
  async playCardAudio(cardId: string): Promise<void> {
    if (this.isMuted) return;
    
    try {
      // 停止当前播放
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }
      
      // 获取音频数据
      const audioData = audioMap[cardId]?.[this.voiceType];
      if (!audioData) {
        console.warn(`未找到卡牌 ${cardId} 的音频数据`);
        return;
      }
      
      // 创建音频对象
      const audio = new Audio(audioData);
      audio.volume = this.volume;
      
      // 播放音频
      this.currentAudio = audio;
      await audio.play();
      
      // 播放完成后清理
      audio.onended = () => {
        this.currentAudio = null;
      };
      
    } catch (error) {
      console.error(`播放卡牌 ${cardId} 音频失败:`, error);
    }
  }
  
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }
  
  setVoiceType(type: 'yunxi' | 'xiaoyi'): void {
    this.voiceType = type;
  }
  
  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted && this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }
}
```

#### 3. 音频控制组件
```typescript
// VoiceSelector.tsx
export function VoiceSelector() {
  const [volume, setVolume] = useState(70);
  const [voiceType, setVoiceType] = useState<'yunxi' | 'xiaoyi'>('yunxi');
  const [isMuted, setIsMuted] = useState(false);
  
  // 音量控制
  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    audioPlayer.setVolume(vol / 100);
  };
  
  // 语音类型切换
  const handleVoiceChange = (newVoice: 'yunxi' | 'xiaoyi') => {
    setVoiceType(newVoice);
    audioPlayer.setVoiceType(newVoice);
  };
  
  // 静音控制
  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioPlayer.setMuted(newMuted);
  };
  
  return (
    <div className="voice-selector">
      <Slider
        value={[volume]}
        onValueChange={handleVolumeChange}
        max={100}
        step={1}
      />
      <Select value={voiceType} onValueChange={handleVoiceChange}>
        <SelectItem value="yunxi">云希</SelectItem>
        <SelectItem value="xiaoyi">小艺</SelectItem>
      </Select>
      <Button onClick={handleMuteToggle}>
        {isMuted ? <VolumeX /> : <Volume2 />}
      </Button>
    </div>
  );
}
```

### 调用方式
```typescript
// 播放卡牌音频
await audioPlayer.playCardAudio(cardId);

// 设置音量 (0-1)
audioPlayer.setVolume(0.7);

// 切换语音类型
audioPlayer.setVoiceType('xiaoyi');

// 静音控制
audioPlayer.setMuted(true);

// 测试音频播放
testRealAudioPlayback();
```

---

## AI系统

### 核心文件
- `client/src/lib/gameEngine.ts` - AI逻辑
- `client/src/hooks/useLocalGameState.ts` - AI状态管理

### 实现原理

#### 1. AI决策系统
```typescript
// AI玩家决策逻辑
class SimpleAIEngine {
  makeDecision(gameState: GameState, aiPlayerId: number): AIDecision {
    const aiPlayer = gameState.players[aiPlayerId];
    const currentCard = gameState.currentCard;
    
    // 1. 寻找可出的牌
    const playableCards = aiPlayer.cards.filter(card => 
      canPlayCard(card, currentCard)
    );
    
    if (playableCards.length > 0) {
      // 2. 选择最优卡牌
      const bestCard = selectBestCard(playableCards, gameState);
      return {
        type: 'play',
        cardId: bestCard,
        reasoning: `选择出牌: ${bestCard}`
      };
    } else {
      // 3. 无法出牌，选择抽牌
      return {
        type: 'draw',
        reasoning: '无法出牌，选择抽牌'
      };
    }
  }
  
  private selectBestCard(cards: string[], gameState: GameState): string {
    // AI策略：优先出元素牌，其次出类型牌
    const elementCards = cards.filter(card => card.includes('_'));
    const typeCards = cards.filter(card => !card.includes('_'));
    
    if (elementCards.length > 0) {
      return elementCards[0];
    } else {
      return typeCards[0];
    }
  }
}
```

#### 2. AI助手系统
```typescript
// AI助手状态管理
interface AIAssistantState {
  active: boolean;           // 是否激活
  targetPlayerId: number;    // 目标玩家ID
  showCountdown: boolean;    // 显示倒计时
  isAssisting: boolean;      // 正在辅助
  lastUpdate: number;        // 最后更新时间
}

// AI助手逻辑
function startAIAssistant(playerId: number): void {
  const aiAssistant: AIAssistantState = {
    active: true,
    targetPlayerId: playerId,
    showCountdown: true,
    isAssisting: false,
    lastUpdate: Date.now()
  };
  
  updateGameState({ aiAssistant });
  
  // 30秒后自动辅助
  setTimeout(() => {
    if (gameState.aiAssistant?.active) {
      performAIAssist(playerId);
    }
  }, 30000);
}

function performAIAssist(playerId: number): void {
  const player = gameState.players[playerId];
  const aiDecision = aiEngine.makeDecision(gameState, playerId);
  
  updateGameState({
    aiAssistant: {
      ...gameState.aiAssistant!,
      isAssisting: true
    }
  });
  
  // 执行AI建议的操作
  setTimeout(() => {
    if (aiDecision.type === 'play') {
      playCard(aiDecision.cardId);
    } else {
      drawCard();
    }
  }, 2000);
}
```

### 调用方式
```typescript
// 处理AI回合
const handleAITurn = async (aiPlayerId: number) => {
  const aiDecision = aiEngine.makeDecision(gameState, aiPlayerId);
  
  if (aiDecision.type === 'play') {
    await playCard(aiDecision.cardId);
  } else {
    await drawCard();
  }
};

// 启动AI助手
startAIAssistant(humanPlayerId);

// 停止AI助手
stopAIAssistant();
```

---

## 数据存储

### 核心文件
- `server/storage.ts` - 存储接口
- `server/storage/DatabaseStorage.ts` - 数据库存储
- `shared/schema.ts` - 数据模型

### 实现原理

#### 1. 存储接口设计
```typescript
// 统一存储接口
export interface IStorage {
  // 用户管理
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // 游戏管理
  createGame(hostId: number, mode?: "single", playerName?: string): Promise<GameState>;
  getGame(id: number): Promise<GameState | undefined>;
  updateGame(gameState: GameState): Promise<GameState>;
  deleteGame(id: number): Promise<void>;
  
  // 卡牌管理
  getAllCards(): Promise<GameCard[]>;
  getCard(id: string): Promise<GameCard | undefined>;
  
  // 排行榜管理
  uploadToLeaderboard(data: InsertGlobalLeaderboard): Promise<GlobalLeaderboard>;
  getGlobalLeaderboard(): Promise<GlobalLeaderboard[]>;
  checkDeviceUploaded(deviceId: string): Promise<boolean>;
  checkPlayerName(playerName: string): Promise<GlobalLeaderboard | null>;
  updateLeaderboard(playerName: string, data: InsertGlobalLeaderboard): Promise<GlobalLeaderboard>;
}
```

#### 2. 数据库存储实现
```typescript
// DatabaseStorage.ts
export class DatabaseStorage implements IStorage {
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async uploadToLeaderboard(data: InsertGlobalLeaderboard): Promise<GlobalLeaderboard> {
    const [record] = await db
      .insert(globalLeaderboard)
      .values(data)
      .returning();
    return record;
  }
  
  async getGlobalLeaderboard(): Promise<GlobalLeaderboard[]> {
    return await db
      .select()
      .from(globalLeaderboard)
      .orderBy(desc(globalLeaderboard.totalScore))
      .limit(100);
  }
  
  async updateLeaderboard(playerName: string, data: InsertGlobalLeaderboard): Promise<GlobalLeaderboard> {
    const [updated] = await db
      .update(globalLeaderboard)
      .set(data)
      .where(eq(globalLeaderboard.playerName, playerName))
      .returning();
    return updated;
  }
}
```

#### 3. 数据模型定义
```typescript
// shared/schema.ts
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const globalLeaderboard = pgTable("global_leaderboard", {
  id: serial("id").primaryKey(),
  playerName: varchar("player_name", { length: 100 }).notNull(),
  deviceId: varchar("device_id", { length: 100 }).notNull(),
  totalScore: integer("total_score").notNull().default(0),
  gamesPlayed: integer("games_played").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  defeats: integer("defeats").notNull().default(0),
  smallWins: integer("small_wins").notNull().default(0),
  doubleKills: integer("double_kills").notNull().default(0),
  quadKills: integer("quad_kills").notNull().default(0),
  lastPlayed: timestamp("last_played").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 调用方式
```typescript
// 使用统一存储接口
const user = await storage.createUser({ username: "player1" });
const leaderboard = await storage.getGlobalLeaderboard();
await storage.uploadToLeaderboard(scoreData);
```

---

## 调试工具

### 核心文件
- `client/src/utils/scoreDebugger.ts` - 积分调试工具
- `client/src/utils/testAutoUpload.ts` - 自动上传测试工具

### 实现原理

#### 1. 积分调试工具
```typescript
// scoreDebugger.ts
export function debugScoreSystem(): void {
  const scores = getPermanentScores();
  console.log('📊 积分系统状态:', scores);
  
  Object.entries(scores).forEach(([playerId, data]) => {
    console.log(`玩家 ${data.playerName}:`, {
      积分: data.totalScore,
      游戏局数: data.gamesPlayed,
      胜利次数: data.wins,
      成就: data.achievements
    });
  });
}

export function fixHumanPlayerScore(targetScore: number): void {
  const scores = getPermanentScores();
  const humanPlayers = Object.keys(scores).filter(k => k.startsWith('human_'));
  
  if (humanPlayers.length === 0) {
    console.log('❌ 没有找到人类玩家数据');
    return;
  }
  
  const playerId = humanPlayers[0];
  const playerData = scores[playerId];
  
  scores[playerId] = {
    ...playerData,
    totalScore: targetScore
  };
  
  localStorage.setItem(PERMANENT_SCORES_KEY, JSON.stringify(scores));
  console.log(`✅ 已将 ${playerData.playerName} 的积分修改为 ${targetScore}`);
}
```

#### 2. 自动上传测试工具
```typescript
// testAutoUpload.ts
export function testAutoUpload(): void {
  const scores = getPermanentScores();
  const humanPlayers = Object.keys(scores).filter(key => key.startsWith('human_'));
  
  console.log(`📊 发现 ${humanPlayers.length} 个人类玩家`);
  
  humanPlayers.forEach(playerId => {
    const playerName = scores[playerId].playerName;
    console.log(`📤 测试上传: ${playerName}`);
    
    tryAutoUploadPlayer(playerName).then(success => {
      console.log(`${success ? '✅' : '❌'} ${playerName} 上传${success ? '成功' : '失败'}`);
    });
  });
}

export function checkUploadQueue(): void {
  const pending = localStorage.getItem('hexagram_uno_pending_uploads');
  const queue = pending ? JSON.parse(pending) : [];
  
  console.log(`📋 待上传队列: ${queue.length} 个项目`);
  
  if (queue.length > 0) {
    console.log('🔄 尝试处理待上传队列...');
    processPendingUploads();
  }
}
```

### 调用方式
```typescript
// 在浏览器控制台中使用
debugScoreSystem();                    // 查看积分系统状态
fixHumanPlayerScore(300);             // 修复人类玩家积分
testAutoUpload();                     // 测试自动上传
checkUploadQueue();                   // 检查上传队列
forceSyncAllPlayers();                // 强制同步所有玩家
```

---

## API接口

### 核心文件
- `server/index.ts` - 服务器入口
- `server/routes/leaderboard.ts` - 排行榜API路由

### 实现原理

#### 1. 服务器配置
```typescript
// server/index.ts
const app = express();
const server = createServer(app);

// 中间件配置
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 错误处理中间件
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  
  if (res.headersSent) {
    return;
  }
  
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong"
  });
});
```

#### 2. 排行榜API路由
```typescript
// server/routes/leaderboard.ts
export async function uploadLeaderboard(req: Request, res: Response) {
  try {
    const data = req.body;
    
    // 验证数据
    const validatedData = insertGlobalLeaderboardSchema.parse(data);
    
    // 上传到数据库
    const result = await storage.uploadToLeaderboard(validatedData);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('上传排行榜失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export async function getLeaderboard(req: Request, res: Response) {
  try {
    const leaderboard = await storage.getGlobalLeaderboard();
    
    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('获取排行榜失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

#### 3. API端点
```typescript
// API路由注册
app.post("/api/leaderboard/upload", uploadLeaderboard);
app.get("/api/leaderboard", getLeaderboard);
app.get("/api/leaderboard/check-device/:deviceId", checkDeviceUploaded);
app.get("/api/leaderboard/check-player/:playerName", checkPlayerName);
app.put("/api/leaderboard/update/:playerName", updateLeaderboard);

// 卡牌API
app.get("/api/cards", async (req, res) => {
  const cards = await storage.getAllCards();
  res.json(cards);
});

app.get("/api/cards/:id", async (req, res) => {
  const card = await storage.getCard(req.params.id);
  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }
  res.json(card);
});
```

### 调用方式
```typescript
// 客户端API调用
const response = await fetch('/api/leaderboard/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(uploadData)
});

const result = await response.json();

// 获取排行榜
const leaderboard = await fetch('/api/leaderboard').then(r => r.json());
```

---

## 总结

这个文档详细记录了六十四卦UNO游戏的所有核心功能实现方式，包括：

1. **游戏引擎** - 完整的游戏逻辑和状态管理
2. **积分系统** - 永久积分计算和持久化存储
3. **排行榜系统** - 自动上传和离线队列管理
4. **音频系统** - 完全离线的音频播放
5. **AI系统** - 智能对手和助手机制
6. **数据存储** - 统一的存储接口和数据库操作
7. **调试工具** - 开发和测试辅助工具
8. **API接口** - 后端服务和路由配置

每个部分都包含了详细的实现原理、核心代码示例和调用方式，为后续的功能修改和扩展提供了完整的技术参考。