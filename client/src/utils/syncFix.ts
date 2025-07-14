/**
 * 积分同步修复工具
 * 用于修复本地和云端积分数据不一致的问题
 */

import { getPermanentScores, savePermanentScores, type PermanentScoreData } from './permanentScores';
import { getGlobalLeaderboard, type LeaderboardUploadData } from './globalLeaderboard';
import { tryAutoUploadPlayer } from './autoUpload';
import { getDeviceId } from './deviceId';

/**
 * 检查特定玩家的本地和云端数据是否一致
 */
export async function checkPlayerDataSync(playerName: string): Promise<{
  localScore: number;
  cloudScore: number;
  inSync: boolean;
  localData: PermanentScoreData | null;
  cloudData: any;
}> {
  // 获取本地数据
  const localScores = getPermanentScores();
  const localData = localScores[`human_${playerName}`] || null;
  
  // 获取云端数据
  try {
    const response = await fetch(`/api/leaderboard/check-player/${encodeURIComponent(playerName)}`);
    const result = await response.json();
    
    const cloudData = result.exists ? result.playerData : null;
    const localScore = localData ? localData.totalScore : 0;
    const cloudScore = cloudData ? cloudData.totalScore : 0;
    
    return {
      localScore,
      cloudScore,
      inSync: localScore === cloudScore,
      localData,
      cloudData
    };
  } catch (error) {
    console.error('检查云端数据失败:', error);
    return {
      localScore: localData ? localData.totalScore : 0,
      cloudScore: 0,
      inSync: true, // 无法检查时假设一致
      localData,
      cloudData: null
    };
  }
}

/**
 * 强制上传本地数据覆盖云端数据
 */
export async function forceUploadLocalData(playerName: string): Promise<boolean> {
  console.log(`🔄 强制上传 ${playerName} 的本地数据到云端...`);
  
  const result = await tryAutoUploadPlayer(playerName);
  
  if (result) {
    console.log(`✅ ${playerName} 本地数据已强制上传到云端`);
  } else {
    console.log(`❌ ${playerName} 本地数据上传失败`);
  }
  
  return result;
}

/**
 * 下载云端数据到本地（覆盖本地数据）
 */
export async function downloadCloudDataToLocal(playerName: string): Promise<boolean> {
  try {
    console.log(`🔄 下载 ${playerName} 的云端数据到本地...`);
    
    const response = await fetch(`/api/leaderboard/check-player/${encodeURIComponent(playerName)}`);
    const result = await response.json();
    
    if (!result.exists) {
      console.log(`❌ 云端不存在 ${playerName} 的数据`);
      return false;
    }
    
    const cloudData = result.playerData;
    
    // 转换云端数据格式为本地格式
    const localData: PermanentScoreData = {
      playerId: `human_${playerName}`,
      playerName: playerName,
      totalScore: cloudData.totalScore,
      gamesPlayed: cloudData.gamesPlayed,
      wins: cloudData.wins,
      defeats: cloudData.defeats,
      clearCards: cloudData.clearCards || 0,
      achievements: {
        smallWins: cloudData.smallWins || 0,
        doubleKills: cloudData.doubleKills || 0,
        quadKills: cloudData.quadKills || 0,
      },
      scoreHistory: [
        {
          timestamp: Date.now(),
          oldScore: 0,
          newScore: cloudData.totalScore,
          change: cloudData.totalScore,
          reason: '云端数据同步',
          gameId: `sync_${Date.now()}`
        }
      ],
      lastPlayed: new Date(cloudData.lastPlayed).getTime()
    };
    
    // 保存到本地
    const scores = getPermanentScores();
    scores[`human_${playerName}`] = localData;
    savePermanentScores(scores);
    
    console.log(`✅ ${playerName} 云端数据已同步到本地`);
    return true;
  } catch (error) {
    console.error(`❌ 下载 ${playerName} 云端数据失败:`, error);
    return false;
  }
}

/**
 * 自动修复数据不一致问题
 * 选择保留更新的数据
 */
export async function autoFixDataSync(playerName: string): Promise<boolean> {
  console.log(`🔄 自动修复 ${playerName} 的数据同步问题...`);
  
  const syncCheck = await checkPlayerDataSync(playerName);
  
  if (syncCheck.inSync) {
    console.log(`✅ ${playerName} 数据已同步，无需修复`);
    return true;
  }
  
  console.log(`⚠️ ${playerName} 数据不一致: 本地${syncCheck.localScore}分，云端${syncCheck.cloudScore}分`);
  
  // 决策逻辑：保留更新的数据
  const localLastPlayed = syncCheck.localData?.lastPlayed || 0;
  const cloudLastPlayed = syncCheck.cloudData ? new Date(syncCheck.cloudData.lastPlayed).getTime() : 0;
  
  if (localLastPlayed > cloudLastPlayed) {
    console.log(`📤 本地数据更新，上传到云端`);
    return await forceUploadLocalData(playerName);
  } else {
    console.log(`📥 云端数据更新，下载到本地`);
    return await downloadCloudDataToLocal(playerName);
  }
}

// 添加到全局调试工具
if (typeof window !== 'undefined') {
  (window as any).checkPlayerDataSync = checkPlayerDataSync;
  (window as any).forceUploadLocalData = forceUploadLocalData;
  (window as any).downloadCloudDataToLocal = downloadCloudDataToLocal;
  (window as any).autoFixDataSync = autoFixDataSync;
}