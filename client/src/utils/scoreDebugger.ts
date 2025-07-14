/**
 * 积分系统调试工具
 * 用于检查和修复积分数据问题
 */

import { getPermanentScores, savePermanentScores, createPlayerData } from './permanentScores';
import { getGlobalLeaderboard } from './globalLeaderboard';

// 导出到全局环境，方便调试
declare global {
  interface Window {
    debugScoreSystem: () => void;
    fixHumanPlayerScore: (score: number) => void;
    syncLocalToGlobal: () => void;
    testSpecialEndingAnimation: () => void;
  }
}

/**
 * 调试积分系统状态
 */
export function debugScoreSystem() {
  console.log('🔍 积分系统调试报告:');
  console.log('==================');
  
  // 检查localStorage数据
  const localData = getPermanentScores();
  console.log('📱 本地永久积分数据:', localData);
  
  // 检查所有玩家数据  
  Object.keys(localData).forEach(key => {
    console.log(`👤 玩家 ${key}:`, localData[key]);
  });
  
  // 检查全球排行榜数据
  getGlobalLeaderboard().then(globalData => {
    console.log('🌍 全球排行榜数据:', globalData);
    
    // 查找人类玩家在排行榜中的记录
    const humanInGlobal = globalData.find(p => p.playerName === '真崔');
    console.log('👤 人类玩家在全球排行榜中的记录:', humanInGlobal);
    
    // 数据对比
    const humanData = localData['human_真崔'];
    if (humanData && humanInGlobal) {
      console.log('📊 数据对比:');
      console.log('  本地积分:', humanData.totalScore);
      console.log('  全球积分:', humanInGlobal.totalScore);
      console.log('  本地游戏数:', humanData.gamesPlayed);
      console.log('  全球游戏数:', humanInGlobal.gamesPlayed);
    }
  }).catch(error => {
    console.error('获取全球排行榜数据失败:', error);
  });
}

/**
 * 修复人类玩家积分
 */
export function fixHumanPlayerScore(score: number = 300) {
  console.log(`🔧 修复人类玩家积分为: ${score}分`);
  
  const localData = getPermanentScores();
  const humanData = localData['human_真崔'] || createPlayerData('human_真崔', '真崔');
  
  // 更新积分
  humanData.totalScore = score;
  humanData.gamesPlayed = Math.max(humanData.gamesPlayed, 1);
  humanData.lastPlayed = Date.now();
  
  // 保存数据
  localData['human_真崔'] = humanData;
  savePermanentScores(localData);
  
  console.log('✅ 人类玩家积分已修复:', humanData);
}

/**
 * 测试特殊结算的积分变化动画
 */
export async function testSpecialEndingAnimation() {
  console.log('🎭 开始测试特殊结算动画...');
  
  // 模拟特殊结算场景：真崔获得小胜一局
  const mockGameState = {
    id: 999,
    hostId: 1,
    status: 'finished' as const,
    mode: 'single' as const,
    currentPlayer: 0,
    direction: 'clockwise' as const,
    players: [
      { id: 1, name: '真崔', cards: [], score: 120, isAI: false, userId: 1 },
      { id: 2, name: '阿豪', cards: ['card1'], score: 0, isAI: true }, // 被淘汰
      { id: 3, name: '老宋', cards: ['card2'], score: 50, isAI: true },
      { id: 4, name: '阿宗', cards: ['card3'], score: 30, isAI: true }
    ],
    deck: [],
    discardPile: [],
    currentCard: null,
    scores: {},
    round: 1,
    maxPlayers: 4
  };
  
  // 计算积分变化
  const { calculatePermanentScoreChanges } = await import('./permanentScores');
  const changes = calculatePermanentScoreChanges(mockGameState);
  
  console.log('🎯 模拟特殊结算结果:', changes);
  
  // 触发一个自定义事件来模拟特殊结算
  const event = new CustomEvent('testSpecialEnding', {
    detail: {
      gameState: mockGameState,
      changes: changes
    }
  });
  
  window.dispatchEvent(event);
  
  console.log('🎭 特殊结算动画测试已触发！');
}

/**
 * 同步本地数据到全球排行榜
 */
export function syncLocalToGlobal() {
  console.log('🔄 同步本地数据到全球排行榜...');
  
  const localData = getPermanentScores();
  const humanData = localData['human_player'];
  
  if (humanData) {
    // 这里可以添加上传到全球排行榜的逻辑
    console.log('📤 准备上传数据:', humanData);
    console.log('⚠️ 注意：实际上传功能需要在游戏结算页面完成');
  } else {
    console.log('❌ 未找到人类玩家数据');
  }
}

// 在开发环境中导出到全局
if (process.env.NODE_ENV === 'development') {
  window.debugScoreSystem = debugScoreSystem;
  window.fixHumanPlayerScore = fixHumanPlayerScore;
  window.syncLocalToGlobal = syncLocalToGlobal;
  window.testSpecialEndingAnimation = testSpecialEndingAnimation;
  
  console.log('🧪 积分调试工具已加载:');
  console.log('  - debugScoreSystem() 查看积分系统状态');
  console.log('  - fixHumanPlayerScore(300) 修复人类玩家积分');
  console.log('  - syncLocalToGlobal() 同步数据到全球排行榜');
  console.log('  - testSpecialEndingAnimation() 测试特殊结算动画');
}