/**
 * 积分系统测试工具
 */

import { 
  calculatePermanentScoreChanges, 
  applyPermanentScoreChanges,
  getPermanentScores,
  createPlayerData,
  SCORE_CHANGES 
} from './permanentScores';
import type { GameState } from '@shared/schema';

// 测试积分计算逻辑
export function testScoreCalculation() {
  console.log('🧪 开始测试积分计算逻辑...');
  
  // 清空测试数据
  localStorage.removeItem('hexagram_uno_permanent_scores');
  
  // 模拟一箭双雕的游戏状态
  const gameState: GameState = {
    id: 1,
    hostId: 1,
    status: "finished",
    mode: "single",
    currentPlayer: 0,
    direction: "clockwise",
    players: [
      { id: 1, name: "真崔", cards: ["card1"], score: 150, isAI: false, userId: 1 }, // 最高分胜利者
      { id: 2, name: "阿豪", cards: ["card1"], score: 0, isAI: true }, // 失败者1
      { id: 3, name: "老宋", cards: ["card2"], score: 0, isAI: true }, // 失败者2
      { id: 4, name: "阿宗", cards: ["card3"], score: 110, isAI: true }, // 存活者
    ],
    deck: [],
    discardPile: [],
    currentCard: null,
    scores: {},
    round: 1,
    maxPlayers: 4,
  };
  
  // 计算积分变化
  const changes = calculatePermanentScoreChanges(gameState);
  console.log('💰 计算结果:', changes);
  
  // 验证结果
  const winnerChange = changes.find(c => c.playerId === 'human_player');
  const loser1Change = changes.find(c => c.playerId === 'ai_2');
  const loser2Change = changes.find(c => c.playerId === 'ai_3');
  
  console.log('🏆 胜利者变化:', winnerChange);
  console.log('💀 失败者1变化:', loser1Change);
  console.log('💀 失败者2变化:', loser2Change);
  
  // 应用变化
  applyPermanentScoreChanges(changes);
  
  // 检查结果
  const scores = getPermanentScores();
  console.log('📊 最终积分:', scores);
  
  // 验证逻辑
  const expectedWinnerScore = 0 + SCORE_CHANGES.DOUBLE_KILL; // 0 + 200 = 200
  const expectedLoserScore = Math.max(0 + SCORE_CHANGES.DEFEAT, 0); // max(0 + (-100), 0) = 0
  
  console.log('✅ 预期胜利者积分:', expectedWinnerScore);
  console.log('✅ 预期失败者积分:', expectedLoserScore);
  
  // 验证积分变化显示
  console.log('🎯 积分变化显示:');
  console.log('胜利者:', `(${winnerChange?.oldScore || 0}+${winnerChange?.change || 0}=${winnerChange?.newScore || 0})`);
  console.log('失败者:', `(${loser1Change?.oldScore || 0}${loser1Change?.change || 0}=${loser1Change?.newScore || 0})`);
  
  // 验证是否正确
  const isWinnerCorrect = winnerChange?.oldScore === 0 && winnerChange?.change === 200 && winnerChange?.newScore === 200;
  const isLoserCorrect = loser1Change?.oldScore === 0 && loser1Change?.change === -100 && loser1Change?.newScore === 0;
  
  console.log('✅ 验证结果:');
  console.log('胜利者计算正确:', isWinnerCorrect);
  console.log('失败者计算正确:', isLoserCorrect);
  
  return {
    changes,
    finalScores: scores,
    isCorrect: {
      winner: winnerChange?.newScore === expectedWinnerScore,
      loser: loser1Change?.newScore === expectedLoserScore,
    }
  };
}

// 在浏览器控制台运行测试
if (typeof window !== 'undefined') {
  (window as any).testScoreCalculation = testScoreCalculation;
}