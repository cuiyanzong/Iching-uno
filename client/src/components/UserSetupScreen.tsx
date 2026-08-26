import React, { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { isPlayerNameExists, getPlayerScoreByName } from "@/utils/permanentScores";
import { getDeviceId } from "@/utils/deviceId";
import DailyHexagram from "@/components/DailyHexagram";

interface UserSetupScreenProps {
  onUserConfirmed: (playerName: string) => void;
}

export default function UserSetupScreen({ onUserConfirmed }: UserSetupScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [showNameConfirm, setShowNameConfirm] = useState(false);
  const [existingPlayerData, setExistingPlayerData] = useState<any>(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [welcomePlayerName, setWelcomePlayerName] = useState('');
  const [showDeviceConflict, setShowDeviceConflict] = useState(false);

  // 设备冲突检测函数（复制自原App.tsx）
  const checkDeviceIdConflict = async (playerName: string) => {
    try {
      console.log(`🔌 开始设备冲突检测: "${playerName}"`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const url = `/api/leaderboard/check-name/${encodeURIComponent(playerName)}`;
      console.log(`🔌 请求URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`🔌 响应状态: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        console.log('🔌 设备冲突检测API失败，跳过检测');
        return { hasConflict: false };
      }
      
      const data = await response.json();
      console.log(`🔌 服务器响应数据:`, data);
      
      if (data.exists && data.playerData) {
        const currentDeviceId = getDeviceId();
        console.log(`🔌 当前设备ID: ${currentDeviceId}`);
        console.log(`🔌 云端设备ID: ${data.playerData.deviceId}`);
        
        const hasConflict = data.playerData.deviceId !== currentDeviceId;
        
        if (hasConflict) {
          console.log(`⚠️ 设备冲突检测到: ${playerName}`, {
            云端设备: data.playerData.deviceId,
            当前设备: currentDeviceId,
            冲突: true
          });
        } else {
          console.log(`✅ 设备ID匹配，无冲突: ${playerName}`);
        }
        
        return { hasConflict };
      }
      
      console.log(`✅ 云端无此玩家记录，无冲突: ${playerName}`);
      return { hasConflict: false };
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('🔌 设备冲突检测超时，跳过检测');
        } else {
          console.log('🔌 设备冲突检测失败，跳过检测:', error.message);
        }
      } else {
        console.log('🔌 设备冲突检测失败，跳过检测:', String(error));
      }
      return { hasConflict: false };
    }
  };

  // 检查玩家名称是否已存在（复制自原App.tsx）
  const checkPlayerNameExists = async (name: string) => {
    try {
      console.log(`🔍 开始检查玩家名: "${name}"`);
      
      const exists = isPlayerNameExists(name);
      console.log(`🔍 isPlayerNameExists 返回: ${exists}`);
      
      if (exists) {
        const playerData = getPlayerScoreByName(name);
        console.log(`🔍 getPlayerScoreByName 返回:`, playerData);
        return playerData;
      }
      console.log(`🔍 玩家名"${name}"不存在，返回null`);
      return null;
    } catch (error) {
      console.error('🔍 检查玩家名称失败:', error);
      console.log(`🔍 错误详情:`, error);
      return null;
    }
  };

  // 处理名字提交（复制自原App.tsx）
  const handleNameSubmit = async (name: string) => {
    if (!name.trim()) {
      return;
    }
    
    setIsChecking(true);
    setPlayerName(name.trim());
    
    try {
      // 第1步：本地查重
      const existingPlayer = await checkPlayerNameExists(name.trim());
      console.log(`🔍 本地查重结果: 玩家名"${name.trim()}"`, existingPlayer ? '已存在' : '不存在');
      
      // 第2步：设备冲突检测
      const deviceConflict = await checkDeviceIdConflict(name.trim());
      console.log(`🔍 设备冲突检测结果: 玩家名"${name.trim()}"`, deviceConflict.hasConflict ? '有冲突' : '无冲突');
      
      setIsChecking(false);
      
      // 第3步：根据检测结果决定显示哪个弹窗
      if (deviceConflict.hasConflict) {
        console.log(`⚠️ 设备冲突阻止游戏继续: ${name.trim()}`);
        setShowDeviceConflict(true);
        return;
      }
      
      if (existingPlayer) {
        console.log(`✅ 本地玩家继续游戏: ${name.trim()}`);
        setExistingPlayerData(existingPlayer);
        setShowNameConfirm(true);
      } else {
        console.log(`✅ 新玩家加入游戏: ${name.trim()}`);
        setWelcomePlayerName(name.trim());
        setShowWelcomeMessage(true);
      }
    } catch (error) {
      console.error('🔍 名字提交处理失败:', error);
      setIsChecking(false);
      setWelcomePlayerName(name.trim());
      setShowWelcomeMessage(true);
    }
  };

  // 处理确认现有玩家
  const handleNameConfirmOverwrite = () => {
    const finalName = existingPlayerData?.playerName || '';
    setShowNameConfirm(false);
    onUserConfirmed(finalName);
  };

  // 处理欢迎新玩家确认
  const handleWelcomeConfirm = () => {
    setShowWelcomeMessage(false);
    onUserConfirmed(welcomePlayerName);
  };

  // 处理重新输入
  const handleWelcomeReInput = () => {
    setShowWelcomeMessage(false);
    setWelcomePlayerName('');
    setPlayerName('');
  };

  // 处理设备冲突重新输入
  const handleDeviceConflictReInput = () => {
    setShowDeviceConflict(false);
    setPlayerName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center hexagram-bg px-4">
      {/* 字体预加载隐藏元素 */}
      <div className="font-preloader">技能测试</div>
      
      <div className="w-full max-w-lg mx-auto">
        {/* 每日一卦组件 */}
        <DailyHexagram />
        
        {/* 名字输入界面 */}
        <div className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 text-center">输入玩家名称</h2>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="请输入您的名称"
            className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter' && playerName.trim() && !isChecking) {
                handleNameSubmit(playerName);
              }
            }}
          />
          <button
            onClick={() => handleNameSubmit(playerName)}
            disabled={!playerName.trim() || isChecking}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {isChecking ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>检查中...</span>
              </div>
            ) : (
              "进入游戏"
            )}
          </button>
        </div>
      </div>
      
      {/* 名称重复确认对话框 */}
      <AlertDialog open={showNameConfirm} onOpenChange={setShowNameConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>欢迎回来 {existingPlayerData?.playerName}</AlertDialogTitle>
            <AlertDialogDescription>
              {existingPlayerData && (
                `发现本地记录，${existingPlayerData.playerName}（${existingPlayerData.totalScore}分），是否继续游戏？`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowNameConfirm(false);
              setPlayerName('');
            }}>
              重新输入
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleNameConfirmOverwrite}>
              继续使用
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 温馨提示对话框 */}
      <AlertDialog open={showWelcomeMessage} onOpenChange={setShowWelcomeMessage}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>欢迎加入游戏</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3">
                <div>
                  请记住这个名字：<span className="font-semibold text-blue-600">{welcomePlayerName}</span>
                </div>
                <div className="text-sm text-gray-600">
                  在这台设备（ID: <span className="font-mono text-xs">{getDeviceId()}</span>）
                </div>
                <div className="text-sm font-bold text-white">
                  您的名字将与您的积分系统绑定。以相同名字进入游戏会保留积分。
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleWelcomeReInput}>
              重新输入
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleWelcomeConfirm}>
              马上开始
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 设备冲突检测弹窗 */}
      <AlertDialog open={showDeviceConflict} onOpenChange={setShowDeviceConflict}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="sr-only">设备冲突提醒</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              <div className="space-y-3">
                <div className="text-white">
                  名字 <span className="font-bold text-blue-400">'{playerName}'</span> 已被其他设备使用
                </div>
                <div className="text-gray-300 text-sm">
                  为了保护您的积分数据安全，请重新输入一个名字
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDeviceConflictReInput}>
              重新输入
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}