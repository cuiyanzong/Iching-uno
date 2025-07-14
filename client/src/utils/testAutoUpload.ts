/**
 * 测试自动上传功能
 */

import { tryAutoUploadPlayer, processPendingUploads } from './autoUpload';
import { getPermanentScores } from './permanentScores';

// 添加到全局对象，方便在控制台测试
declare global {
  interface Window {
    testAutoUpload: () => void;
    checkUploadQueue: () => void;
    forceSyncAllPlayers: () => void;
  }
}

/**
 * 测试自动上传功能
 */
export function testAutoUpload(): void {
  console.log('🧪 测试自动上传功能...');
  
  const scores = getPermanentScores();
  const humanPlayers = Object.keys(scores).filter(key => key.startsWith('human_'));
  
  console.log(`📊 发现 ${humanPlayers.length} 个人类玩家:`, humanPlayers);
  
  humanPlayers.forEach(playerId => {
    const playerName = scores[playerId].playerName;
    console.log(`📤 测试上传: ${playerName}`);
    
    tryAutoUploadPlayer(playerName).then(success => {
      console.log(`${success ? '✅' : '❌'} ${playerName} 上传${success ? '成功' : '失败'}`);
    }).catch(error => {
      console.error(`❌ ${playerName} 上传错误:`, error);
    });
  });
}

/**
 * 检查上传队列状态
 */
export function checkUploadQueue(): void {
  console.log('📋 检查上传队列状态...');
  
  const pending = localStorage.getItem('hexagram_uno_pending_uploads');
  const queue = pending ? JSON.parse(pending) : [];
  
  console.log(`📋 待上传队列: ${queue.length} 个项目`);
  queue.forEach((item: any, index: number) => {
    console.log(`${index + 1}. ${item.playerName} - ${item.attempts} 次尝试`);
  });
  
  if (queue.length > 0) {
    console.log('🔄 尝试处理待上传队列...');
    processPendingUploads();
  }
}

/**
 * 强制同步所有玩家到云端
 */
export function forceSyncAllPlayers(): void {
  console.log('🚀 强制同步所有玩家到云端...');
  
  const scores = getPermanentScores();
  const humanPlayers = Object.keys(scores).filter(key => key.startsWith('human_'));
  
  console.log(`📊 准备同步 ${humanPlayers.length} 个人类玩家`);
  
  humanPlayers.forEach(playerId => {
    const playerName = scores[playerId].playerName;
    const playerData = scores[playerId];
    
    console.log(`📤 强制同步: ${playerName} (${playerData.totalScore}分)`);
    
    tryAutoUploadPlayer(playerName).then(success => {
      if (success) {
        console.log(`✅ ${playerName} 同步成功`);
      } else {
        console.log(`📋 ${playerName} 已添加到待上传队列`);
      }
    }).catch(error => {
      console.error(`❌ ${playerName} 同步失败:`, error);
    });
  });
}

// 添加到全局对象
if (typeof window !== 'undefined') {
  window.testAutoUpload = testAutoUpload;
  window.checkUploadQueue = checkUploadQueue;
  window.forceSyncAllPlayers = forceSyncAllPlayers;
  
  console.log('🧪 自动上传测试工具已加载:');
  console.log('  - testAutoUpload() 测试自动上传');
  console.log('  - checkUploadQueue() 检查上传队列');
  console.log('  - forceSyncAllPlayers() 强制同步所有玩家');
}