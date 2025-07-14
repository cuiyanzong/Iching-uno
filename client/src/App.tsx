import React, { useEffect, useState, startTransition } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Sword, Fan } from "lucide-react";
import LocalGame from "@/pages/LocalGame";
import TutorialModal from "@/components/TutorialModal";
import type { BattleStyle } from "@shared/schema";

import Leaderboard from "@/components/Leaderboard";
import NotFound from "@/pages/not-found";
import { testScoreCalculation } from "@/utils/scoreTest";
import { clearAllPermanentScores } from "@/utils/clearScores";
import { resetScoreSystem } from "@/utils/resetScores";
import { forceResetAllScores, verifyScoreReset } from "@/utils/forceResetScores";
import { resetAIScores, isPlayerNameExists, getPlayerScoreByName, getPermanentScores, initializePlayerScore } from "@/utils/permanentScores";
import { getDeviceId } from "@/utils/deviceId";
import { checkPendingUploadsOnStartup, setupNetworkListener, getUploadQueueStatus } from "@/utils/autoUpload";
import "@/utils/performanceTest";

function HomePage() {
  const [showLocalGame, setShowLocalGame] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameConfirm, setShowNameConfirm] = useState(false);
  const [existingPlayerData, setExistingPlayerData] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [welcomePlayerName, setWelcomePlayerName] = useState('');
  const [showBattleStyleSelect, setShowBattleStyleSelect] = useState(false);
  const [selectedBattleStyle, setSelectedBattleStyle] = useState<BattleStyle | null>(null);

  // 开发模式下添加测试功能
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).testScoreCalculation = testScoreCalculation;
      (window as any).clearAllPermanentScores = clearAllPermanentScores;
      (window as any).resetScoreSystem = resetScoreSystem;
      (window as any).forceResetAllScores = forceResetAllScores;
      (window as any).verifyScoreReset = verifyScoreReset;
      (window as any).getUploadQueueStatus = getUploadQueueStatus;
      
      // 音频调试工具
      import('@/lib/localAudio').then(({ audioManager }) => {
        (window as any).checkAudioStatus = () => {
          console.log('🔊 音频系统状态检查:');
          console.log('  - 启用状态:', audioManager.isEnabled());
          console.log('  - 当前语音:', audioManager.getVoice());
          console.log('  - 音量:', audioManager.getVolume());
          console.log('  - localStorage设置:', localStorage.getItem('audio-settings'));
        };
        
        (window as any).testAudioPlay = (cardId = 'fire_fire_li') => {
          console.log(`🔊 测试播放卡牌音频: ${cardId}`);
          audioManager.playAudio(cardId);
        };
        
        (window as any).forceEnableAudio = () => {
          console.log('🔊 强制启用音频系统');
          audioManager.setEnabled(true);
          audioManager.setVolume(0.8);
          console.log('✅ 音频系统已启用');
        };
      });
      
      console.log('🧪 积分测试功能已加载:');
      console.log('  - testScoreCalculation() 测试积分计算');
      console.log('  - clearAllPermanentScores() 清理所有积分数据');
      console.log('  - resetScoreSystem() 重置积分系统并刷新页面');
      console.log('  - forceResetAllScores() 强制重置所有积分');
      console.log('  - verifyScoreReset() 验证积分重置状态');
      console.log('  - getUploadQueueStatus() 查看上传队列状态');
      console.log('🔊 音频调试功能已加载:');
      console.log('  - checkAudioStatus() 检查音频系统状态');
      console.log('  - testAudioPlay() 测试音频播放');
      console.log('  - forceEnableAudio() 强制启用音频');
    }
  }, []);

  // 启动时检查待上传数据和设置网络监听
  useEffect(() => {
    // 检查待上传数据
    checkPendingUploadsOnStartup();
    
    // 设置网络状态监听
    const cleanupNetworkListener = setupNetworkListener();
    
    return cleanupNetworkListener;
  }, []);

  const startLocalGame = () => {
    startTransition(() => {
      setShowNameInput(true);
    });
  };

  // 添加调试功能
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).checkLocalStorage = () => {
        console.log('🔍 本地存储检查:');
        console.log('localStorage keys:', Object.keys(localStorage));
        console.log('permanent scores:', localStorage.getItem('hexagram_uno_permanent_scores'));
        const scores = getPermanentScores();
        console.log('getPermanentScores():', scores);
        console.log('isPlayerNameExists("真崔"):', isPlayerNameExists('真崔'));
        console.log('getPlayerScoreByName("真崔"):', getPlayerScoreByName('真崔'));
      };
      
      // 创建测试数据功能
      (window as any).createTestData = () => {
        console.log('🔧 创建测试数据...');
        const testScores = {
          'human_真崔': {
            playerId: 'human_真崔',
            playerName: '真崔',
            totalScore: 300,
            gamesPlayed: 5,
            wins: 3,
            defeats: 2,
            clearCards: 8,
            achievements: {
              smallWins: 2,
              doubleKills: 1,
              quadKills: 0
            },
            scoreHistory: [
              {
                timestamp: Date.now() - 86400000,
                oldScore: 200,
                newScore: 300,
                change: 100,
                reason: '小胜一局',
                gameId: 'game_123'
              }
            ],
            lastPlayed: Date.now() - 86400000
          }
        };
        localStorage.setItem('hexagram_uno_permanent_scores', JSON.stringify(testScores));
        console.log('✅ 测试数据已创建');
      };
      
      console.log('🔍 调试工具已加载: checkLocalStorage()');
      console.log('🔧 测试工具已加载: createTestData()');
    }
  }, []);

  // 检查玩家名称是否已存在（本地检查）
  const checkPlayerNameExists = async (name: string) => {
    try {
      // 使用本地积分记录检查，不再依赖全球排行榜
      console.log(`🔍 开始检查玩家名: "${name}"`);
      
      // 检查本地存储的所有积分数据
      const allScores = getPermanentScores();
      console.log(`🔍 所有本地积分数据:`, allScores);
      console.log(`🔍 所有键名:`, Object.keys(allScores));
      
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

  const handleNameSubmit = async (name: string) => {
    if (!name.trim()) {
      return;
    }
    
    setIsChecking(true);
    const existingPlayer = await checkPlayerNameExists(name.trim());
    setIsChecking(false);
    
    console.log(`🔍 查重结果: 玩家名"${name.trim()}"`, existingPlayer ? '已存在' : '不存在');
    console.log('🔍 现有玩家数据:', existingPlayer);
    
    if (existingPlayer) {
      setPlayerName(name.trim());
      setExistingPlayerData(existingPlayer);
      setShowNameConfirm(true);
    } else {
      // 名称不存在，显示温馨提示
      setWelcomePlayerName(name.trim());
      setShowWelcomeMessage(true);
    }
  };

  const handleNameConfirmOverwrite = () => {
    setPlayerName(existingPlayerData?.playerName || '');
    setShowNameConfirm(false);
    setShowNameInput(false);
    // 显示战斗风格选择
    setShowBattleStyleSelect(true);
  };

  const handleNameCancel = () => {
    setShowNameInput(false);
  };

  const handleWelcomeConfirm = () => {
    setPlayerName(welcomePlayerName);
    setShowWelcomeMessage(false);
    setShowNameInput(false);
    // 显示战斗风格选择
    setShowBattleStyleSelect(true);
  };

  const handleWelcomeReInput = () => {
    setShowWelcomeMessage(false);
    setWelcomePlayerName('');
    setShowNameInput(true);
  };

  const handleBattleStyleSelect = (style: BattleStyle) => {
    setSelectedBattleStyle(style);
    setShowBattleStyleSelect(false);
    // 重置AI积分
    resetAIScores();
    startTransition(() => {
      setShowLocalGame(true);
    });
  };



  const backToHome = () => {
    startTransition(() => {
      setShowLocalGame(false);
      setPlayerName('');
      setSelectedBattleStyle(null);
    });
  };

  if (showLocalGame) {
    return <LocalGame playerName={playerName} battleStyle={selectedBattleStyle} onBackToHome={backToHome} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center hexagram-bg">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">六十四卦 UNO</h1>
        <p className="text-gray-300 mb-8">中国传统文化与现代卡牌游戏的完美结合</p>
        
        <div className="space-y-4 max-w-sm mx-auto">
          <button
            onClick={startLocalGame}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            开始游戏
          </button>
          
          <button
            onClick={() => startTransition(() => setShowLeaderboard(true))}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            积分排行榜
          </button>
          
          <button
            onClick={() => startTransition(() => setShowTutorial(true))}
            className="w-full border border-white/20 text-white py-2 px-4 rounded hover:bg-white/10"
          >
            游戏教程
          </button>
        </div>
      </div>
      
      {showNameInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-white mb-4">输入玩家名称</h2>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="请输入您的名称"
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleNameSubmit(playerName)}
                disabled={!playerName.trim() || isChecking}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded"
              >
                {isChecking ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>检查中...</span>
                  </div>
                ) : (
                  "开始游戏"
                )}
              </button>
              <button
                onClick={handleNameCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showLeaderboard && (
        <Leaderboard
          onClose={() => startTransition(() => setShowLeaderboard(false))}
        />
      )}
      
      {showTutorial && (
        <TutorialModal 
          isOpen={showTutorial}
          onClose={() => startTransition(() => setShowTutorial(false))}
          onStartTutorial={() => startTransition(() => setShowTutorial(false))}
        />
      )}
      
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
              setShowNameInput(true);
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

      {/* 战斗风格选择对话框 */}
      <AlertDialog open={showBattleStyleSelect} onOpenChange={setShowBattleStyleSelect}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <AlertDialogHeader className="flex-shrink-0">
            <AlertDialogTitle className="text-center text-2xl">选择战斗风格</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              不同战斗分数体系会有不同的游戏体验
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 快意恩仇 */}
              <div 
                className="border-2 border-red-500/50 bg-red-900/20 rounded-lg p-6 cursor-pointer hover:border-red-400 hover:bg-red-900/30 transition-all duration-300"
                onClick={() => handleBattleStyleSelect("quick")}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <Sword className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-red-400 text-center mb-3">快意恩仇</h3>
                <div className="text-gray-300 text-center mb-4">
                  <p className="text-lg font-semibold mb-2">所有玩家初始战斗分50分</p>
                  <p className="text-sm">累计扣住对手5张手牌结束战斗</p>
                </div>
                <div className="text-orange-300 text-sm bg-orange-900/20 p-3 rounded">
                  <strong>特点：</strong>风浪越大鱼越贵，更容易获胜也容易丢分
                </div>
              </div>

              {/* 运筹帷幄 */}
              <div 
                className="border-2 border-blue-500/50 bg-blue-900/20 rounded-lg p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-900/30 transition-all duration-300"
                onClick={() => handleBattleStyleSelect("strategic")}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <Fan className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-blue-400 text-center mb-3">运筹帷幄</h3>
                <div className="text-gray-300 text-center mb-4">
                  <p className="text-lg font-semibold mb-2">所有玩家初始战斗分150分</p>
                  <p className="text-sm">累计扣住对手15张手牌结束战斗</p>
                </div>
                <div className="text-green-300 text-sm bg-green-900/20 p-3 rounded">
                  <strong>特点：</strong>会有多个回合的回旋余地，用好策略可以实现绝地反杀
                </div>
              </div>
            </div>
          </div>


        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/local" component={() => <LocalGame playerName="玩家" onBackToHome={() => window.location.href = '/'} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // 游戏完全离线运行，无需网络客户端

  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
