import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertGlobalLeaderboardSchema } from '@shared/schema';

export async function uploadLeaderboard(req: Request, res: Response) {
  try {
    console.log('收到排行榜数据:', req.body);
    
    // 转换 lastPlayed 从时间戳到日期
    const requestData = { ...req.body };
    if (requestData.lastPlayed) {
      if (typeof requestData.lastPlayed === 'number') {
        requestData.lastPlayed = new Date(requestData.lastPlayed);
      } else if (typeof requestData.lastPlayed === 'string') {
        requestData.lastPlayed = new Date(parseInt(requestData.lastPlayed));
      }
    }
    
    console.log('转换后的数据:', requestData);
    
    const data = insertGlobalLeaderboardSchema.parse(requestData);
    const result = await storage.uploadToLeaderboard(data);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('上传排行榜失败:', error);
    res.status(500).json({ error: '上传失败', details: error.message });
  }
}

export async function getLeaderboard(req: Request, res: Response) {
  try {
    const leaderboard = await storage.getGlobalLeaderboard();
    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error('获取排行榜失败:', error);
    res.status(500).json({ error: '获取失败' });
  }
}

export async function checkDeviceUploaded(req: Request, res: Response) {
  try {
    const { deviceId } = req.params;
    const uploaded = await storage.checkDeviceUploaded(deviceId);
    res.json({ uploaded });
  } catch (error) {
    console.error('检查设备上传状态失败:', error);
    res.status(500).json({ error: '检查失败' });
  }
}

export async function checkPlayerName(req: Request, res: Response) {
  try {
    const { playerName } = req.params;
    const existingPlayer = await storage.checkPlayerName(playerName);
    res.json({ 
      exists: !!existingPlayer,
      playerData: existingPlayer 
    });
  } catch (error) {
    console.error('检查玩家名称失败:', error);
    res.status(500).json({ error: '检查失败' });
  }
}

export async function updateLeaderboard(req: Request, res: Response) {
  try {
    const { playerName } = req.params;
    const updateData = req.body;
    
    // 转换 lastPlayed 从时间戳到日期
    const requestData = { ...updateData };
    if (requestData.lastPlayed) {
      if (typeof requestData.lastPlayed === 'number') {
        requestData.lastPlayed = new Date(requestData.lastPlayed);
      } else if (typeof requestData.lastPlayed === 'string') {
        requestData.lastPlayed = new Date(parseInt(requestData.lastPlayed));
      }
    }
    
    const data = insertGlobalLeaderboardSchema.parse(requestData);
    const result = await storage.updateLeaderboard(playerName, data);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('更新排行榜失败:', error);
    res.status(500).json({ error: '更新失败', details: error.message });
  }
}