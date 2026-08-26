# 六十四卦 UNO 游戏 - 完整系统文档

## 系统概述

这是一个完全离线的单人卡牌游戏，结合了传统中国易经六十四卦文化与现代UNO游戏机制。系统支持AI对手、积分系统、全球排行榜，并具备完整的音频体验。

## 核心功能

### 1. 游戏引擎
- **单人模式**: 1个人类玩家 + 3个AI对手
- **游戏逻辑**: 基于UNO规则，使用六十四卦卡牌
- **AI系统**: 智能AI对手，具备不同性格和策略
- **AI助手**: 为人类玩家提供智能提示和自动操作

### 2. 积分系统
- **永久积分**: 跨游戏局数累积的个人积分
- **积分规则**: 
  - 小胜一局: +100分
  - 一箭双雕: +200分  
  - 大杀四方: +300分
  - 失败扣分: -100分（不低于0分）
- **数据持久化**: 基于localStorage的本地数据存储
- **积分历史**: 完整的积分变化记录

### 3. 排行榜系统
- **全球排行榜**: 云端数据库存储的全球玩家排名
- **自动上传**: 积分变化后自动同步到云端
- **离线队列**: 网络不可用时的待上传队列管理
- **设备绑定**: 基于设备ID的玩家身份识别

### 4. 音频系统
- **完全离线**: 1.8MB Base64编码的音频数据
- **双语音支持**: 云希、小艺两种语音包
- **实时播放**: 卡牌出牌时的中文语音提示
- **音频控制**: 音量调节、语音切换、静音功能

## 技术架构

### 前端架构
```
client/
├── src/
│   ├── components/          # React组件
│   │   ├── GameBoard.tsx    # 游戏主界面
│   │   ├── GameCompletionModal.tsx  # 游戏结算弹窗
│   │   ├── VoiceSelector.tsx        # 音频控制组件
│   │   └── ...
│   ├── pages/              # 页面组件
│   │   ├── LocalGame.tsx   # 本地游戏页面
│   │   └── ...
│   ├── utils/              # 工具函数
│   │   ├── permanentScores.ts    # 积分系统
│   │   ├── autoUpload.ts         # 自动上传
│   │   ├── globalLeaderboard.ts  # 排行榜API
│   │   ├── localAudio.ts         # 音频系统
│   │   └── deviceId.ts           # 设备ID管理
│   └── lib/                # 核心库
│       ├── gameEngine.ts   # 游戏引擎
│       └── localAudio.ts   # 音频核心
```

### 后端架构
```
server/
├── index.ts                # 服务器入口
├── storage.ts              # 存储层抽象
├── db.ts                   # 数据库连接
├── routes/                 # API路由
│   └── leaderboard.ts      # 排行榜API
└── storage/                # 存储实现
    └── DatabaseStorage.ts  # 数据库存储
```

### 数据库设计
```sql
-- 用户表
users (id, username, email, created_at)

-- 游戏卡牌表
game_cards (id, name, element, description, image_url, audio_url)

-- 全球排行榜表
global_leaderboard (
  id, player_name, device_id, total_score, games_played,
  wins, defeats, small_wins, double_kills, quad_kills, last_played
)

-- 其他辅助表
games, challenge_users, game_records
```

## 核心系统详解

### 1. 积分系统机制

#### 数据结构
```typescript
interface PermanentScoreData {
  playerId: string;          // 玩家ID (human_playerName)
  playerName: string;        // 玩家名称
  totalScore: number;        // 总积分
  gamesPlayed: number;       // 游戏局数
  wins: number;              // 胜利次数
  defeats: number;           // 失败次数
  clearCards: number;        // 清牌次数
  achievements: {            // 成就统计
    smallWins: number;       // 小胜次数
    doubleKills: number;     // 双杀次数
    quadKills: number;       // 四杀次数
  };
  scoreHistory: Array<{      // 积分历史
    timestamp: number;
    oldScore: number;
    newScore: number;
    change: number;
    reason: string;
    gameId: string;
  }>;
  lastPlayed: number;        // 最后游戏时间
}
```

#### 积分计算逻辑
```typescript
// 1. 分析游戏结果
const humanPlayer = players.find(p => !p.isAI);
const aiPlayers = players.filter(p => p.isAI);

// 2. 计算积分变化
if (humanPlayer.cards.length === 0) {
  // 人类玩家获胜
  const aisWith0Cards = aiPlayers.filter(ai => ai.cards.length === 0).length;
  if (aisWith0Cards >= 3) {
    change = 300; reason = "大杀四方";
  } else if (aisWith0Cards >= 2) {
    change = 200; reason = "一箭双雕";
  } else {
    change = 100; reason = "小胜一局";
  }
} else {
  // 人类玩家失败
  change = -100; reason = "游戏失败";
}

// 3. 应用积分变化
newScore = Math.max(0, oldScore + change);
```

### 2. 自动上传机制

#### 上传触发点
```typescript
// 游戏结束后自动触发
changes.forEach(change => {
  if (change.playerId.startsWith('human_')) {
    tryAutoUploadPlayer(change.playerName);
  }
});
```

#### 网络检测与离线队列
```typescript
// 1. 检查网络状态
const isConnected = await testNetworkConnection();

// 2. 有网络时直接上传
if (isConnected) {
  await uploadToGlobalLeaderboard(uploadData);
} else {
  // 3. 无网络时加入待上传队列
  addToPendingQueue(playerName, uploadData);
}
```

### 3. 音频系统架构

#### 音频数据结构
```typescript
// audioBase64.js - 1.8MB Base64编码音频数据
const audioMap = {
  "sky_wind_xiaoxu": {
    "yunxi": "data:audio/wav;base64,UklGRiQ...",
    "xiaoyi": "data:audio/wav;base64,UklGRiQ..."
  },
  // ... 128张卡牌的音频数据
};
```

#### 音频播放逻辑
```typescript
// 1. 获取卡牌音频
const audioData = audioMap[cardId]?.[voiceType];

// 2. 创建音频对象
const audio = new Audio(audioData);

// 3. 播放音频
audio.volume = volume;
audio.play();
```

## 部署配置

### 环境要求
- Node.js 20.x
- PostgreSQL 数据库
- 支持ES模块的环境

### 环境变量
```bash
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
PORT=5000
```

### 构建命令
```bash
# 开发环境
npm run dev

# 生产构建
npm run build

# 生产启动
npm start

# 数据库迁移
npm run db:push
```

### 部署检查清单
- [x] 数据库连接正常
- [x] 音频系统完全离线
- [x] 积分系统数据持久化
- [x] 自动上传功能正常
- [x] 排行榜API正常响应
- [x] 前端资源正确构建
- [x] 生产环境错误处理

## 系统优化

### 性能优化
1. **音频预加载**: 1.8MB音频数据在应用启动时加载
2. **本地存储**: 积分数据使用localStorage缓存
3. **网络优化**: 智能重连机制，离线队列管理
4. **代码分割**: 按需加载非核心功能

### 稳定性保证
1. **错误处理**: 完善的try-catch和错误恢复机制
2. **数据完整性**: 多层次的数据验证和修复
3. **网络容错**: 自动重试和离线降级处理
4. **内存管理**: 及时清理游戏状态和音频对象

## 调试工具

### 开发环境工具
```javascript
// 积分系统调试
debugScoreSystem()           // 查看积分系统状态
fixHumanPlayerScore(300)     // 修复人类玩家积分
testScoreCalculation()       // 测试积分计算

// 自动上传调试
testAutoUpload()             // 测试自动上传
checkUploadQueue()           // 检查上传队列
forceSyncAllPlayers()        // 强制同步所有玩家

// 音频系统调试
testRealAudioPlayback()      // 测试音频播放
checkAudioData()             // 检查音频数据完整性
```

## 未来扩展方向

### 功能扩展
1. **多人在线模式**: WebSocket实时对战
2. **更多游戏模式**: 时间限制模式、挑战模式
3. **社交功能**: 好友系统、聊天功能
4. **个性化**: 自定义卡牌皮肤、音效

### 技术升级
1. **PWA支持**: 离线安装、推送通知
2. **移动端优化**: 响应式设计、触摸优化
3. **AI升级**: 更智能的AI对手、机器学习
4. **云同步**: 跨设备数据同步

## 维护指南

### 常见问题排查
1. **积分不保存**: 检查localStorage权限和存储空间
2. **音频不播放**: 检查浏览器音频政策和音量设置
3. **上传失败**: 检查网络连接和数据库状态
4. **游戏卡顿**: 检查内存使用和错误日志

### 数据库维护
```sql
-- 清理过期数据
DELETE FROM global_leaderboard WHERE last_played < NOW() - INTERVAL '1 year';

-- 优化索引
CREATE INDEX idx_leaderboard_score ON global_leaderboard(total_score DESC);
CREATE INDEX idx_leaderboard_player ON global_leaderboard(player_name);
```

### 日志监控
- 服务器错误日志：`server/logs/error.log`
- 用户行为日志：浏览器控制台
- 数据库查询日志：PostgreSQL日志
- 网络请求日志：Network面板

---

**系统版本**: v1.0.0
**最后更新**: 2025年7月12日
**状态**: 生产就绪
**维护者**: 系统开发团队