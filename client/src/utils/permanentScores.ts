/**
 * 永久积分系统管理工具
 * 管理跨局游戏的积分数据
 */

import type { GameState, Player } from '@shared/schema';

export interface PermanentScoreData {
  playerId: string;
  playerName: string;
  totalScore: number;
  gamesPlayed: number;
  wins: number;
  defeats: number;
  clearCards: number;   // 清牌次数
  achievements: {
    smallWins: number;    // 小胜一局次数
    doubleKills: number;  // 一箭双雕次数
    quadKills: number;    // 团灭次数
  };
  scoreHistory: ScoreHistoryRecord[];
  lastPlayed: number;
}

export interface ScoreHistoryRecord {
  timestamp: number;
  oldScore: number;
  newScore: number;
  change: number;
  reason: string;
  gameId: string;
}

export interface PermanentScoreChange {
  playerId: string;
  playerName: string;
  oldScore: number;
  newScore: number;
  change: number;
  reason: string;
}

// 积分变化常量
export const SCORE_CHANGES = {
  SMALL_WIN: 100,     // 小胜一局
  DOUBLE_KILL: 200,   // 一箭双雕
  QUAD_KILL: 300,     // 团灭
  DEFEAT: -100,       // 分数清零
} as const;

// 本地存储键名
const PERMANENT_SCORES_KEY = 'hexagram_uno_permanent_scores';

/**
 * 获取所有永久积分数据
 */
export function getPermanentScores(): Record<string, PermanentScoreData> {
  try {
    const data = localStorage.getItem(PERMANENT_SCORES_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('读取永久积分数据失败:', error);
    return {};
  }
}

/**
 * 保存永久积分数据
 */
export function savePermanentScores(scores: Record<string, PermanentScoreData>): void {
  try {
    localStorage.setItem(PERMANENT_SCORES_KEY, JSON.stringify(scores));
  } catch (error) {
    console.error('保存永久积分数据失败:', error);
  }
}

/**
 * 创建新玩家数据
 */
export function createPlayerData(playerId: string, playerName: string): PermanentScoreData {
  return {
    playerId,
    playerName,
    totalScore: 0, // 新玩家默认0分
    gamesPlayed: 0,
    wins: 0,
    defeats: 0,
    clearCards: 0,
    achievements: {
      smallWins: 0,
      doubleKills: 0,
      quadKills: 0,
    },
    scoreHistory: [],
    lastPlayed: Date.now(),
  };
}

/**
 * 计算永久积分变化
 */
export function calculatePermanentScoreChanges(gameState: GameState): PermanentScoreChange[] {
  // 检查是否有玩家被淘汰（分数归零）
  const eliminatedPlayers = gameState.players.filter(p => p.score <= 0);
  
  // 如果没有玩家被淘汰，这是普通回合结算，只记录清牌次数
  if (eliminatedPlayers.length === 0) {
    return calculateClearCardChanges(gameState);
  }

  // 特殊结算：有玩家被淘汰
  return calculateSpecialEndingChanges(gameState, eliminatedPlayers);
}

/**
 * 计算清牌次数变化（普通回合结算）
 */
function calculateClearCardChanges(gameState: GameState): PermanentScoreChange[] {
  // 找到清牌的玩家
  const clearCardPlayer = gameState.players.find(player => player.cards.length === 0);
  
  if (!clearCardPlayer) {
    return []; // 没有清牌玩家，不记录任何变化
  }

  const changes: PermanentScoreChange[] = [];
  const currentScores = getPermanentScores();
  
  // 处理所有玩家（包括AI和人类）
  gameState.players.forEach(player => {
    const playerId = player.isAI ? `ai_${player.id}` : `human_${player.name}`;
    const playerData = currentScores[playerId] || createPlayerData(playerId, player.name);
    
    // 如果是人类玩家，确保使用正确的积分数据
    if (!player.isAI) {
      const existingPlayerData = getPlayerScoreByName(player.name);
      if (existingPlayerData) {
        console.log(`🔄 使用现有积分数据: ${player.name} ${existingPlayerData.totalScore}分`);
        playerData.totalScore = existingPlayerData.totalScore;
        playerData.wins = existingPlayerData.wins;
        playerData.defeats = existingPlayerData.defeats;
        playerData.clearCards = existingPlayerData.clearCards;
        playerData.gamesPlayed = existingPlayerData.gamesPlayed;
        playerData.achievements = existingPlayerData.achievements;
        playerData.scoreHistory = existingPlayerData.scoreHistory;
      }
    }
    
    let scoreChange = 0;
    let reason = '';
    
    // 清牌玩家不获得积分，只记录清牌次数
    if (player.id === clearCardPlayer.id) {
      scoreChange = 0; // 普通胜利不增加积分
      reason = '清牌获胜';
    }
    
    // 记录积分变化
    changes.push({
      playerId,
      playerName: player.name,
      oldScore: playerData.totalScore,
      newScore: playerData.totalScore + scoreChange,
      change: scoreChange,
      reason: reason || '参与游戏',
    });
  });

  return changes;
}

/**
 * 计算特殊结算的积分变化
 */
function calculateSpecialEndingChanges(gameState: GameState, eliminatedPlayers: any[]): PermanentScoreChange[] {
  // 找到本局最高分数（可能有多个玩家同分）
  const maxScore = Math.max(...gameState.players.map(p => p.score));
  const winners = gameState.players.filter(p => p.score === maxScore && p.score > 0);

  console.log('🎯 特殊结算积分计算:', {
    所有玩家分数: gameState.players.map(p => ({ 姓名: p.name, 分数: p.score })),
    最高分数: maxScore,
    胜利者: winners.map(w => ({ 姓名: w.name, 分数: w.score, ID: w.id })),
    淘汰玩家数: eliminatedPlayers.length
  });

  const changes: PermanentScoreChange[] = [];
  const currentScores = getPermanentScores();

  // 处理所有玩家的积分变化（包括AI玩家）
  gameState.players.forEach(player => {
    const playerId = player.isAI ? `ai_${player.id}` : `human_${player.name}`;
    const playerData = currentScores[playerId] || createPlayerData(playerId, player.name);
    
    // 对于人类玩家，确保使用正确的积分数据
    if (!player.isAI) {
      const existingPlayerData = getPlayerScoreByName(player.name);
      if (existingPlayerData) {
        console.log(`🔄 使用现有积分数据: ${player.name} ${existingPlayerData.totalScore}分`);
        // 使用现有数据更新当前数据
        playerData.totalScore = existingPlayerData.totalScore;
        playerData.wins = existingPlayerData.wins;
        playerData.defeats = existingPlayerData.defeats;
        playerData.clearCards = existingPlayerData.clearCards;
        playerData.gamesPlayed = existingPlayerData.gamesPlayed;
        playerData.achievements = existingPlayerData.achievements;
        playerData.scoreHistory = existingPlayerData.scoreHistory;
      }
    } else {
      // 对于AI玩家，重要：不要使用已经更新的积分数据作为基准
      // 需要确保使用的是本局游戏开始时的积分，而不是已经累积的积分
      console.log(`🤖 AI玩家积分数据: ${player.name} 当前积分=${playerData.totalScore}`);
    }
    
    let scoreChange = 0;
    let reason = '';
    
    // 检查是否是胜利者（可能有多个同分胜利者）
    const isWinner = winners.some(w => w.id === player.id);
    
    if (isWinner) {
      // 胜利者获得积分
      const eliminatedCount = eliminatedPlayers.length;
      if (eliminatedCount === 1) {
        scoreChange = SCORE_CHANGES.SMALL_WIN;
        reason = '小胜一局';
      } else if (eliminatedCount === 2) {
        scoreChange = SCORE_CHANGES.DOUBLE_KILL;
        reason = '一箭双雕';
      } else if (eliminatedCount === 3) {
        scoreChange = SCORE_CHANGES.QUAD_KILL;
        reason = '大杀四方';
      }
    } else if (player.score <= 0) {
      // 失败者扣分
      scoreChange = SCORE_CHANGES.DEFEAT;
      reason = '分数清零';
    }
    
    if (scoreChange !== 0) {
      // 🔑 关键修复：确保使用正确的基准积分
      // 对于AI玩家，需要使用游戏开始时的积分，而不是已经更新的积分
      let baseScore = playerData.totalScore;
      
      // 如果是AI玩家且已经有历史记录，说明积分可能已经被更新过
      // 需要从历史记录中找到最近的积分基准
      if (player.isAI && playerData.scoreHistory.length > 0) {
        // 检查最近的积分记录是否是今天的（可能是本轮游戏中的更新）
        const lastRecord = playerData.scoreHistory[playerData.scoreHistory.length - 1];
        const today = new Date().toDateString();
        const lastRecordDate = new Date(lastRecord.timestamp).toDateString();
        
        if (lastRecordDate === today) {
          // 如果最近记录是今天的，使用该记录的 oldScore 作为基准
          baseScore = lastRecord.oldScore;
          console.log(`🔧 AI玩家 ${player.name} 使用历史基准积分: ${baseScore}`);
        }
      }
      
      const newScore = Math.max(baseScore + scoreChange, 0);
      const actualChange = newScore - baseScore;
      
      console.log(`💰 ${player.name} 积分变化计算:`, {
        基准积分: baseScore,
        积分变化: scoreChange,
        新积分: newScore,
        实际变化: actualChange,
        原因: reason
      });
      
      changes.push({
        playerId,
        playerName: player.name,
        oldScore: baseScore,
        newScore,
        change: actualChange,
        reason,
      });
    }
  });

  return changes;
}

/**
 * 应用永久积分变化
 */
export function applyPermanentScoreChanges(changes: PermanentScoreChange[]): Record<string, PermanentScoreData> {
  const currentScores = getPermanentScores();
  const gameId = `game_${Date.now()}`;

  changes.forEach(change => {
    const { playerId, playerName, oldScore, newScore, change: scoreChange, reason } = change;
    
    // 获取或创建玩家数据
    const playerData = currentScores[playerId] || createPlayerData(playerId, playerName);
    
    // 调试日志
    console.log(`🔍 处理积分变化 ${playerName} (${playerId}):`, {
      当前积分: playerData.totalScore,
      预期旧积分: oldScore,
      新积分: newScore,
      变化: scoreChange,
      原因: reason
    });
    
    // 如果是人类玩家，检查积分数据是否正确
    if (playerId.startsWith('human_')) {
      const actualPlayerData = getPlayerScoreByName(playerName);
      console.log(`📊 ${playerName} 积分数据检查:`, {
        本地查询结果: actualPlayerData,
        当前数据: playerData,
        localStorage中的数据: JSON.parse(localStorage.getItem('hexagram_uno_permanent_scores') || '{}')
      });
    }
    
    // 🔑 关键修复：简化积分处理逻辑
    // 直接使用计算出的积分变化，不要重置或修改
    console.log(`📊 处理积分变化: ${playerName} 当前${playerData.totalScore}分 → ${newScore}分`);
    
    // 确保积分数据正确更新
    if (playerId.startsWith('human_')) {
      console.log(`👤 人类玩家积分更新: ${playerName}`);
    } else {
      console.log(`🤖 AI玩家积分更新: ${playerName}`);
    }
    
    // 更新总积分 - 重要：不要重复计算积分
    console.log(`📊 更新 ${playerName} 积分: ${playerData.totalScore} → ${newScore}`);
    playerData.totalScore = newScore;
    playerData.gamesPlayed += 1;
    playerData.lastPlayed = Date.now();
    
    // 更新胜负记录
    if (scoreChange > 0) {
      playerData.wins += 1;
      
      // 更新成就
      if (scoreChange === SCORE_CHANGES.SMALL_WIN) {
        playerData.achievements.smallWins += 1;
      } else if (scoreChange === SCORE_CHANGES.DOUBLE_KILL) {
        playerData.achievements.doubleKills += 1;
      } else if (scoreChange === SCORE_CHANGES.QUAD_KILL) {
        playerData.achievements.quadKills += 1;
      }
    } else if (scoreChange < 0) {
      playerData.defeats += 1;
    } else if (scoreChange === 0) {
      // 处理积分无变化的情况（清牌次数）
      if (reason === '清牌获胜') {
        playerData.clearCards += 1;
      }
    }
    
    // 记录历史
    playerData.scoreHistory.push({
      timestamp: Date.now(),
      oldScore,
      newScore,
      change: scoreChange,
      reason,
      gameId,
    });
    
    // 保持历史记录在100条以内
    if (playerData.scoreHistory.length > 100) {
      playerData.scoreHistory = playerData.scoreHistory.slice(-100);
    }
    
    currentScores[playerId] = playerData;
  });

  // 保存更新后的数据（包括AI玩家）到localStorage
  savePermanentScores(currentScores);
  console.log('📊 积分数据已保存到localStorage:', currentScores);
  
  return currentScores;
}

/**
 * 获取积分变化预览（不保存）
 */
export function previewPermanentScoreChanges(gameState: GameState): PermanentScoreChange[] {
  return calculatePermanentScoreChanges(gameState);
}

/**
 * 获取排行榜数据
 */
export function getLeaderboard(): PermanentScoreData[] {
  const scores = getPermanentScores();
  
  return Object.values(scores)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10); // 只取前10名
}

/**
 * 获取单个玩家的积分数据
 */
export function getPlayerScore(playerId: string): PermanentScoreData | null {
  const scores = getPermanentScores();
  return scores[playerId] || null;
}

/**
 * 根据玩家名字获取积分数据
 */
export function getPlayerScoreByName(playerName: string): PermanentScoreData | null {
  const playerId = `human_${playerName}`;
  return getPlayerScore(playerId);
}

/**
 * 更新玩家名称
 */
export function updatePlayerName(playerId: string, newName: string): void {
  const scores = getPermanentScores();
  const playerData = scores[playerId];
  
  if (playerData) {
    playerData.playerName = newName;
    savePermanentScores(scores);
  }
}

/**
 * 检查玩家名字是否已存在（本地检查）
 */
export function isPlayerNameExists(playerName: string): boolean {
  const playerId = `human_${playerName}`;
  const scores = getPermanentScores();
  return playerId in scores;
}

/**
 * 重置AI玩家积分（游戏开始时调用）
 */
export function resetAIScores(): void {
  const currentScores = getPermanentScores();
  const keysToRemove = Object.keys(currentScores).filter(key => key.startsWith('ai_'));
  
  keysToRemove.forEach(key => {
    delete currentScores[key];
  });
  
  localStorage.setItem('hexagram_uno_permanent_scores', JSON.stringify(currentScores));
  console.log('✅ AI玩家积分已重置');
}

/**
 * 初始化玩家积分记录（游戏开始时调用）
 * 如果玩家不存在，创建初始积分记录
 */
export function initializePlayerScore(playerName: string): void {
  const playerId = `human_${playerName}`;
  const currentScores = getPermanentScores();
  
  // 如果玩家已存在，不做任何操作
  if (currentScores[playerId]) {
    console.log(`✅ 玩家 ${playerName} 积分记录已存在: ${currentScores[playerId].totalScore}分`);
    return;
  }
  
  // 创建新的积分记录
  const newPlayerData = createPlayerData(playerId, playerName);
  currentScores[playerId] = newPlayerData;
  
  savePermanentScores(currentScores);
  console.log(`✅ 为玩家 ${playerName} 创建了新的积分记录: 0分起始`);
}