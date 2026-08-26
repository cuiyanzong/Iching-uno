import type { GlobalLeaderboard } from "@shared/schema";

export interface LeaderboardUploadData {
  playerName: string;
  deviceId: string;
  totalScore: number;
  gamesPlayed: number;
  roundsPlayed: number;
  wins: number;
  defeats: number;
  draws: number;
  clearCards: number;
  smallWins: number;
  doubleKills: number;
  quadKills: number;
  lastPlayed: number; // timestamp
}

export async function uploadToGlobalLeaderboard(data: LeaderboardUploadData): Promise<boolean> {
  try {
    // 导入设备ID函数
    const { getDeviceId } = await import('./deviceId');
    
    // 恢复原有的直接上传逻辑，保持覆盖机制不变
    const uploadData = {
      ...data,
      deviceId: getDeviceId(),
    };

    const response = await fetch('/api/leaderboard/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('上传到全球排行榜失败:', error);
    return false;
  }
}

export async function getGlobalLeaderboard(): Promise<GlobalLeaderboard[]> {
  try {
    const response = await fetch('/api/leaderboard');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.leaderboard || [];
  } catch (error) {
    console.error('获取全球排行榜失败:', error);
    return [];
  }
}

export async function checkDeviceUploaded(): Promise<boolean> {
  try {
    // 导入设备ID函数
    const { getDeviceId } = await import('./deviceId');
    
    const response = await fetch(`/api/leaderboard/check-device/${getDeviceId()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.hasUploaded;
  } catch (error) {
    console.error('检查设备上传状态失败:', error);
    return false;
  }
}

/**
 * 检查云端是否已存在指定玩家名称
 */
export async function checkCloudPlayerName(playerName: string): Promise<GlobalLeaderboard | null> {
  try {
    const response = await fetch(`/api/leaderboard/check-player/${encodeURIComponent(playerName)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.exists ? data.playerData : null;
  } catch (error) {
    console.error('检查云端玩家名称失败:', error);
    return null;
  }
}

/**
 * 更新全球排行榜中的玩家数据
 */
export async function updateGlobalLeaderboard(playerName: string, data: LeaderboardUploadData): Promise<boolean> {
  try {
    // 导入设备ID函数
    const { getDeviceId } = await import('./deviceId');
    
    const updateData = {
      ...data,
      deviceId: getDeviceId(),
    };

    const response = await fetch(`/api/leaderboard/update/${encodeURIComponent(playerName)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('更新全球排行榜失败:', error);
    return false;
  }
}