/**
 * 强制重置积分系统
 */

import { createPlayerData } from './permanentScores';

export function forceResetAllScores() {
  try {
    // 1. 完全清除localStorage
    localStorage.removeItem('hexagram_uno_permanent_scores');
    
    // 2. 创建全新的空白数据结构
    const freshScores = {};
    
    // 3. 保存空白数据
    localStorage.setItem('hexagram_uno_permanent_scores', JSON.stringify(freshScores));
    
    console.log('✅ 积分系统已完全重置');
    console.log('📊 所有玩家积分归零');
    
    return true;
  } catch (error) {
    console.error('❌ 强制重置失败:', error);
    return false;
  }
}

export function verifyScoreReset() {
  try {
    const scores = JSON.parse(localStorage.getItem('hexagram_uno_permanent_scores') || '{}');
    console.log('🔍 当前积分数据:', scores);
    
    const playerCount = Object.keys(scores).length;
    console.log(`👥 玩家数量: ${playerCount}`);
    
    if (playerCount === 0) {
      console.log('✅ 积分系统已完全清空');
      return true;
    } else {
      console.log('⚠️ 仍有积分数据存在');
      return false;
    }
  } catch (error) {
    console.error('❌ 验证失败:', error);
    return false;
  }
}

// 在浏览器控制台中添加强制重置功能
if (typeof window !== 'undefined') {
  (window as any).forceResetAllScores = forceResetAllScores;
  (window as any).verifyScoreReset = verifyScoreReset;
}