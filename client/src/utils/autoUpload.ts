/**
 * 自动上传排行榜数据工具
 * 支持有网络时自动上传，无网络时离线队列管理
 */

import { uploadToGlobalLeaderboard, checkDeviceUploaded, type LeaderboardUploadData } from './globalLeaderboard';
import { getPermanentScores, type PermanentScoreData } from './permanentScores';
import { getDeviceId } from './deviceId';

// 离线队列存储键名
const PENDING_UPLOADS_KEY = 'hexagram_uno_pending_uploads';

interface PendingUpload {
  playerName: string;
  data: LeaderboardUploadData;
  timestamp: number;
  attempts: number;
}

/**
 * 检查网络连接状态
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * 测试网络连接性（发送轻量级请求）
 */
export async function testNetworkConnection(): Promise<boolean> {
  try {
    // 添加网络检查保护，避免在无网络时产生错误
    if (!navigator.onLine) {
      console.log('📶 navigator.onLine 显示离线，跳过网络测试');
      return false;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时，适应网络环境
    
    const response = await fetch('/api/leaderboard', {
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    // 静默处理网络错误，避免产生 unhandledrejection
    if (error.name === 'AbortError') {
      console.log('📶 网络连接测试超时');
    } else {
      console.log('📶 网络连接测试失败:', error.message);
    }
    return false;
  }
}

/**
 * 获取待上传队列
 */
function getPendingUploads(): PendingUpload[] {
  try {
    const data = localStorage.getItem(PENDING_UPLOADS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('读取待上传队列失败:', error);
    return [];
  }
}

/**
 * 保存待上传队列
 */
function savePendingUploads(uploads: PendingUpload[]): void {
  try {
    localStorage.setItem(PENDING_UPLOADS_KEY, JSON.stringify(uploads));
  } catch (error) {
    console.error('保存待上传队列失败:', error);
  }
}

/**
 * 添加到待上传队列
 */
function addToPendingQueue(playerName: string, data: LeaderboardUploadData): void {
  const uploads = getPendingUploads();
  
  // 检查是否已存在相同玩家的待上传记录
  const existingIndex = uploads.findIndex(upload => upload.playerName === playerName);
  
  const pendingUpload: PendingUpload = {
    playerName,
    data,
    timestamp: Date.now(),
    attempts: 0
  };
  
  if (existingIndex >= 0) {
    // 更新现有记录
    uploads[existingIndex] = pendingUpload;
    console.log(`📋 更新待上传队列: ${playerName}`);
  } else {
    // 添加新记录
    uploads.push(pendingUpload);
    console.log(`📋 添加到待上传队列: ${playerName}`);
  }
  
  savePendingUploads(uploads);
}

/**
 * 从待上传队列中移除
 */
function removeFromPendingQueue(playerName: string): void {
  const uploads = getPendingUploads();
  const filteredUploads = uploads.filter(upload => upload.playerName !== playerName);
  
  if (filteredUploads.length !== uploads.length) {
    savePendingUploads(filteredUploads);
    console.log(`🗑️ 从待上传队列移除: ${playerName}`);
  }
}

/**
 * 将本地积分数据转换为上传格式
 */
function convertToUploadData(playerData: PermanentScoreData): LeaderboardUploadData {
  return {
    playerName: playerData.playerName,
    deviceId: getDeviceId(), // 🔑 关键修复：添加设备ID
    totalScore: playerData.totalScore,
    gamesPlayed: playerData.gamesPlayed,
    roundsPlayed: playerData.roundsPlayed,
    wins: playerData.wins,
    defeats: playerData.defeats,
    draws: playerData.draws || 0,
    clearCards: playerData.clearCards,
    smallWins: playerData.achievements.smallWins,
    doubleKills: playerData.achievements.doubleKills,
    quadKills: playerData.achievements.quadKills,
    lastPlayed: playerData.lastPlayed
  };
}

/**
 * 尝试自动上传单个玩家数据
 */
export async function tryAutoUploadPlayer(playerName: string): Promise<boolean> {
  try {
    // 检查网络连接
    if (!isOnline()) {
      console.log(`📶 离线状态，将 ${playerName} 添加到待上传队列`);
      const localData = getPermanentScores();
      const playerData = localData[`human_${playerName}`];
      
      if (playerData) {
        const uploadData = convertToUploadData(playerData);
        addToPendingQueue(playerName, uploadData);
      }
      return false;
    }
    
    // 测试网络连接
    const isConnected = await testNetworkConnection();
    if (!isConnected) {
      console.log(`🔌 网络连接失败，将 ${playerName} 添加到待上传队列`);
      const localData = getPermanentScores();
      const playerData = localData[`human_${playerName}`];
      
      if (playerData) {
        const uploadData = convertToUploadData(playerData);
        addToPendingQueue(playerName, uploadData);
      }
      return false;
    }
    
    // 获取本地数据
    const localData = getPermanentScores();
    const playerData = localData[`human_${playerName}`];
    
    if (!playerData) {
      console.log(`❌ 未找到 ${playerName} 的本地数据`);
      return false;
    }
    
    // 转换为上传格式
    const uploadData = convertToUploadData(playerData);
    
    // 尝试上传
    console.log(`📤 自动上传 ${playerName} 的数据...`);
    const success = await uploadToGlobalLeaderboard(uploadData);
    
    if (success) {
      console.log(`✅ ${playerName} 数据上传成功`);
      // 从待上传队列中移除
      removeFromPendingQueue(playerName);
      return true;
    } else {
      console.log(`❌ ${playerName} 数据上传失败，添加到待上传队列`);
      addToPendingQueue(playerName, uploadData);
      return false;
    }
  } catch (error) {
    console.error(`上传 ${playerName} 数据时发生错误:`, error);
    
    // 出错时也添加到待上传队列
    const localData = getPermanentScores();
    const playerData = localData[`human_${playerName}`];
    
    if (playerData) {
      const uploadData = convertToUploadData(playerData);
      addToPendingQueue(playerName, uploadData);
    }
    
    return false;
  }
}

/**
 * 处理所有待上传的数据
 */
export async function processPendingUploads(): Promise<void> {
  const uploads = getPendingUploads();
  
  if (uploads.length === 0) {
    console.log('📋 没有待上传的数据');
    return;
  }
  
  console.log(`📋 处理 ${uploads.length} 个待上传项目...`);
  
  // 检查网络连接
  if (!isOnline()) {
    console.log('📶 离线状态，跳过待上传处理');
    return;
  }
  
  const isConnected = await testNetworkConnection();
  if (!isConnected) {
    console.log('🔌 网络连接失败，跳过待上传处理');
    return;
  }
  
  const successfulUploads: string[] = [];
  const failedUploads: PendingUpload[] = [];
  
  for (const upload of uploads) {
    try {
      upload.attempts++;
      
      console.log(`📤 重试上传 ${upload.playerName} (第${upload.attempts}次)...`);
      const success = await uploadToGlobalLeaderboard(upload.data);
      
      if (success) {
        console.log(`✅ ${upload.playerName} 补传成功`);
        successfulUploads.push(upload.playerName);
      } else {
        console.log(`❌ ${upload.playerName} 补传失败`);
        
        // 如果重试次数少于5次，保留在队列中
        if (upload.attempts < 5) {
          failedUploads.push(upload);
        } else {
          console.log(`⚠️ ${upload.playerName} 重试次数过多，从队列中移除`);
        }
      }
    } catch (error) {
      console.error(`处理 ${upload.playerName} 时发生错误:`, error);
      
      // 保留在队列中，但增加尝试次数
      if (upload.attempts < 5) {
        failedUploads.push(upload);
      }
    }
  }
  
  // 更新待上传队列（只保留失败的项目）
  savePendingUploads(failedUploads);
  
  console.log(`📊 处理完成: ${successfulUploads.length} 成功, ${failedUploads.length} 失败`);
}

/**
 * 检查并处理启动时的待上传数据
 */
export async function checkPendingUploadsOnStartup(): Promise<void> {
  try {
    console.log('🚀 检查启动时的待上传数据...');
    
    // 等待一小段时间确保应用完全加载
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 静默处理，避免网络错误影响应用启动
    await processPendingUploads().catch(error => {
      console.log('📶 启动时处理上传队列失败（预期行为）:', error.message);
    });
  } catch (error) {
    console.log('📶 启动时检查待上传数据失败（预期行为）:', error.message);
  }
}

/**
 * 监听网络状态变化
 */
export function setupNetworkListener(): void {
  const handleOnline = () => {
    console.log('📶 网络已连接，处理待上传数据...');
    processPendingUploads();
  };
  
  const handleOffline = () => {
    console.log('📶 网络已断开');
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // 返回清理函数
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * 获取待上传队列状态（用于调试）
 */
export function getUploadQueueStatus(): {
  pending: number;
  uploads: PendingUpload[];
} {
  const uploads = getPendingUploads();
  return {
    pending: uploads.length,
    uploads
  };
}