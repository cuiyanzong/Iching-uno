import { fixAllPlayerData, debugPlayerData, getPermanentScores, savePermanentScores } from './permanentScores';

/**
 * 玩家数据修复工具
 */
export function initPlayerDataFixer() {
  if (typeof window !== 'undefined') {
    // 数据修复工具
    (window as any).fixAllPlayerData = fixAllPlayerData;
    (window as any).debugPlayerData = debugPlayerData;
    
    // 手动强制数据迁移
    (window as any).forceDataMigration = () => {
      console.log('🔄 强制执行数据迁移...');
      const scores = getPermanentScores(); // 这会自动触发迁移
      savePermanentScores(scores); // 保存迁移后的数据
      console.log('✅ 数据迁移完成');
    };
    
    // 查看原始数据
    (window as any).viewRawData = () => {
      const rawData = localStorage.getItem('hexagram_uno_permanent_scores');
      if (rawData) {
        console.log('📄 原始数据:', JSON.parse(rawData));
      } else {
        console.log('❌ 没有找到原始数据');
      }
    };
    
    // 创建带有历史记录的测试数据
    (window as any).createTestPlayerWithHistory = () => {
      const testData = {
        'human_测试玩家': {
          playerId: 'human_测试玩家',
          playerName: '测试玩家',
          totalScore: 500,
          gamesPlayed: 20, // 这是旧数据格式，实际包含了回合数
          wins: 8,
          defeats: 3,
          clearCards: 9,
          achievements: {
            smallWins: 3,
            doubleKills: 2,
            quadKills: 1
          },
          scoreHistory: [
            // 普通回合（清牌，无积分变化）
            { timestamp: Date.now() - 86400000 * 15, oldScore: 100, newScore: 100, change: 0, reason: '清牌获胜', gameId: 'game_1' },
            { timestamp: Date.now() - 86400000 * 14, oldScore: 100, newScore: 100, change: 0, reason: '清牌获胜', gameId: 'game_2' },
            { timestamp: Date.now() - 86400000 * 13, oldScore: 100, newScore: 100, change: 0, reason: '清牌获胜', gameId: 'game_3' },
            { timestamp: Date.now() - 86400000 * 12, oldScore: 100, newScore: 100, change: 0, reason: '清牌获胜', gameId: 'game_4' },
            { timestamp: Date.now() - 86400000 * 11, oldScore: 100, newScore: 100, change: 0, reason: '清牌获胜', gameId: 'game_5' },
            { timestamp: Date.now() - 86400000 * 10, oldScore: 100, newScore: 100, change: 0, reason: '清牌获胜', gameId: 'game_6' },
            { timestamp: Date.now() - 86400000 * 9, oldScore: 100, newScore: 100, change: 0, reason: '清牌获胜', gameId: 'game_7' },
            // 特殊结算（积分变化）
            { timestamp: Date.now() - 86400000 * 8, oldScore: 100, newScore: 300, change: 200, reason: '一箭双雕', gameId: 'game_8' },
            { timestamp: Date.now() - 86400000 * 7, oldScore: 300, newScore: 400, change: 100, reason: '小胜一局', gameId: 'game_9' },
            { timestamp: Date.now() - 86400000 * 6, oldScore: 400, newScore: 500, change: 100, reason: '小胜一局', gameId: 'game_10' },
            // 更多普通回合
            { timestamp: Date.now() - 86400000 * 5, oldScore: 500, newScore: 500, change: 0, reason: '清牌获胜', gameId: 'game_11' },
            { timestamp: Date.now() - 86400000 * 4, oldScore: 500, newScore: 500, change: 0, reason: '清牌获胜', gameId: 'game_12' },
            { timestamp: Date.now() - 86400000 * 3, oldScore: 500, newScore: 500, change: 0, reason: '清牌获胜', gameId: 'game_13' },
            { timestamp: Date.now() - 86400000 * 2, oldScore: 500, newScore: 500, change: 0, reason: '清牌获胜', gameId: 'game_14' },
            { timestamp: Date.now() - 86400000 * 1, oldScore: 500, newScore: 500, change: 0, reason: '清牌获胜', gameId: 'game_15' }
          ],
          lastPlayed: Date.now()
        }
      };
      
      const currentData = getPermanentScores();
      const newData = { ...currentData, ...testData };
      localStorage.setItem('hexagram_uno_permanent_scores', JSON.stringify(newData));
      console.log('✅ 创建了带历史记录的测试玩家数据');
      console.log('📊 应该显示: 游戏局数=3, 回合数=15, 胜利数=3');
      console.log('📊 其中: 12个普通回合(清牌获胜,积分不变) + 3个特殊结算(积分变化)');
      
      // 自动修复数据
      fixAllPlayerData();
    };
    
    console.log('🔧 数据修复工具已加载:');
    console.log('  - fixAllPlayerData() 修复所有玩家数据');
    console.log('  - debugPlayerData() 显示玩家数据分析');
    console.log('  - forceDataMigration() 强制数据迁移');
    console.log('  - viewRawData() 查看原始数据');
    console.log('  - createTestPlayerWithHistory() 创建测试数据');
  }
}