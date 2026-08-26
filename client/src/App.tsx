import React, { useEffect, useState, startTransition } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Sword, Fan } from "lucide-react";
import LocalGame from "@/pages/LocalGame";
import TutorialModal from "@/components/TutorialModal";
import UserSetupScreen from "@/components/UserSetupScreen";
import type { BattleStyle } from "@shared/schema";

import Leaderboard from "@/components/Leaderboard";
import NotFound from "@/pages/not-found";
import { testScoreCalculation } from "@/utils/scoreTest";
import { clearAllPermanentScores } from "@/utils/clearScores";
import { resetScoreSystem } from "@/utils/resetScores";
import { forceResetAllScores, verifyScoreReset } from "@/utils/forceResetScores";
import { resetAIScores, getPermanentScores } from "@/utils/permanentScores";
import { checkPendingUploadsOnStartup, setupNetworkListener, getUploadQueueStatus } from "@/utils/autoUpload";
import "@/utils/performanceTest";
import "@/utils/skillSystemTest";

interface HomePageProps {
  currentUser: string;
}

function HomePage({ currentUser }: HomePageProps) {
  const [showLocalGame, setShowLocalGame] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBattleStyleSelect, setShowBattleStyleSelect] = useState(false);
  const [selectedBattleStyle, setSelectedBattleStyle] = useState<BattleStyle | null>(null);

  // 字体预加载和开发模式下添加测试功能
  useEffect(() => {
    // 字体预加载 - iPad兼容性优化，优先使用WOFF2
    const preloadFont = async () => {
      try {
        if ('fonts' in document) {
          // 优先尝试WOFF2格式（更小，移动端支持更好）
          let font;
          try {
            font = new FontFace('HanYiYanKai', 'url(/fonts/HanYiYanKai.woff2) format("woff2")');
            await font.load();
            document.fonts.add(font);
            console.log('✅ 汉仪颜楷繁字体预加载完成 (WOFF2)');
          } catch (woff2Error) {
            // 回退到TTF格式
            console.log('⚠️ WOFF2加载失败，回退到TTF:', woff2Error);
            font = new FontFace('HanYiYanKai', 'url(/fonts/HanYiYanKai.TTF) format("truetype")');
            await font.load();
            document.fonts.add(font);
            console.log('✅ 汉仪颜楷繁字体预加载完成 (TTF备用)');
          }
        }
      } catch (error) {
        console.log('⚠️ 字体预加载失败，将使用CSS备用加载方式:', error);
      }
    };
    
    // 立即开始字体预加载
    preloadFont();
    if (typeof window !== 'undefined') {
      (window as any).testScoreCalculation = testScoreCalculation;
      (window as any).clearAllPermanentScores = clearAllPermanentScores;
      (window as any).resetScoreSystem = resetScoreSystem;
      (window as any).forceResetAllScores = forceResetAllScores;
      (window as any).verifyScoreReset = verifyScoreReset;
      (window as any).getUploadQueueStatus = getUploadQueueStatus;
      
      // 音频调试工具
      import('@/lib/localAudio').then(({ audioManager, testSkillVoiceSystem }) => {
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
        
        // 技能语音测试工具
        (window as any).testSkillVoice = (element = 'earth', voice = 'yunxi') => {
          console.log(`🎭 测试技能语音: ${element} - ${voice}`);
          audioManager.playSkillAudio(element, voice);
        };
        
        (window as any).testAllSkillVoices = () => {
          testSkillVoiceSystem();
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
      console.log('🎭 技能语音调试功能已加载:');
      console.log('  - testSkillVoice(element, voice) 测试单个技能语音');
      console.log('  - testAllSkillVoices() 测试所有技能语音');
    }
  }, []);

  // 启动时检查待上传数据和设置网络监听
  useEffect(() => {
    // 检查待上传数据
    checkPendingUploadsOnStartup();
    
    // 设置网络状态监听
    const cleanupNetworkListener = setupNetworkListener();
    
    // 自动修复现有玩家数据
    import('./utils/permanentScores').then(({ fixAllPlayerData }) => {
      try {
        fixAllPlayerData();
        console.log('✅ 玩家数据自动修复完成');
      } catch (error) {
        console.error('❌ 玩家数据自动修复失败:', error);
      }
    });
    
    return cleanupNetworkListener;
  }, []);

  const startLocalGame = () => {
    startTransition(() => {
      setShowBattleStyleSelect(true);
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
      };
      
      console.log('🔍 调试工具已加载: checkLocalStorage()');
    }
  }, []);

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
      setSelectedBattleStyle(null);
    });
  };

  if (showLocalGame) {
    return <LocalGame playerName={currentUser} battleStyle={selectedBattleStyle} onBackToHome={backToHome} />;
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
      


      {/* 战斗风格选择对话框 */}
      <AlertDialog open={showBattleStyleSelect} onOpenChange={setShowBattleStyleSelect}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <AlertDialogHeader className="flex-shrink-0">
            <AlertDialogTitle className="text-center text-2xl">选择战斗风格</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              不同战斗分数体系会有不同的游戏体验
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
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

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userSetupComplete, setUserSetupComplete] = useState(false);

  // 开发模式下添加测试功能
  // 第二个重复的调试工具部分已删除

  // 启动时检查待上传数据和设置网络监听
  useEffect(() => {
    // 检查待上传数据
    checkPendingUploadsOnStartup();
    
    // 设置网络状态监听
    const cleanupNetworkListener = setupNetworkListener();
    
    // 自动修复现有玩家数据
    import('./utils/permanentScores').then(({ fixAllPlayerData }) => {
      try {
        fixAllPlayerData();
        console.log('✅ 玩家数据自动修复完成');
      } catch (error) {
        console.error('❌ 玩家数据自动修复失败:', error);
      }
    });
    
    return cleanupNetworkListener;
  }, []);

  const handleUserConfirmed = (playerName: string) => {
    setCurrentUser(playerName);
    setUserSetupComplete(true);
  };

  if (!userSetupComplete) {
    return (
      <TooltipProvider>
        <Toaster />
        <UserSetupScreen onUserConfirmed={handleUserConfirmed} />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Toaster />
      <Switch>
        <Route path="/" component={() => <HomePage currentUser={currentUser!} />} />
        <Route path="/local" component={() => <LocalGame playerName="玩家" battleStyle="strategic" onBackToHome={() => window.location.href = '/'} />} />
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  );
}

export default App;

// 强制清理技能动画状态的调试工具
(window as any).clearSkillAnimation = function() {
  const event = new CustomEvent('clearSkillAnimation');
  window.dispatchEvent(event);
  console.log('🎭 强制清理技能动画状态');
};

(window as any).testSkillAnimation = function() {
  const event = new CustomEvent('skillUsed', {
    detail: {
      element: 'fire',
      cardIds: ['fire_sky_dayou', 'fire_earth_jin'],
      skillName: '离字·萤火流光'
    }
  });
  window.dispatchEvent(event);
  console.log('🎭 测试技能动画触发');
};

console.log('🧪 技能动画调试工具已加载:');
console.log('  - clearSkillAnimation() 清理动画状态');
console.log('  - testSkillAnimation() 测试动画触发');

