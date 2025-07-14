/**
 * 本地游戏主界面
 * 单机版游戏页面，保持原有UI设计完全一致
 */

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import GameBoard from "@/components/GameBoard";
import LocalAIAssistTimer from "@/components/LocalAIAssistTimer";
import DirectionChangeNotification from "@/components/DirectionChangeNotification";
import GameCompletionModal from "@/components/GameCompletionModal";
import TutorialModal from "@/components/TutorialModal";
import { useLocalGameState } from "@/hooks/useLocalGameState";
import type { GameState, BattleStyle } from "@shared/schema";


interface LocalGameProps {
  playerName: string;
  battleStyle: BattleStyle | null;
  onBackToHome: () => void;
}

export default function LocalGame({ playerName, battleStyle, onBackToHome }: LocalGameProps) {
  const { toast } = useToast();
  const {
    gameState,
    isLoading,
    error,
    playCard,
    drawCard,
    triggerAIAssist,
    startGame,
    restartGame,
    startNextRound
  } = useLocalGameState();

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showDirectionChange, setShowDirectionChange] = useState(false);
  const [changedToDirection, setChangedToDirection] = useState<"clockwise" | "counterclockwise">("clockwise");
  

  
  // 动画隐藏处理函数 - 重置状态
  const handleHideDirectionChange = () => {
    console.log('🎬 倒转乾坤动画隐藏被调用');
    setShowDirectionChange(false);
  };

  // 测试函数 - 手动触发倒转乾坤动画（模拟真实事件）
  const testDirectionChange = () => {
    console.log('🧪 测试倒转乾坤动画开始 - 模拟真实事件');
    // 模拟真实的 gameDirectionChanged 事件
    window.dispatchEvent(new CustomEvent('gameDirectionChanged', {
      detail: { direction: 'clockwise' }
    }));
  };

  // 将测试函数暴露到全局
  useEffect(() => {
    (window as any).testDirectionChange = testDirectionChange;
    return () => {
      delete (window as any).testDirectionChange;
    };
  }, [testDirectionChange]);
  const [showGameCompletion, setShowGameCompletion] = useState(false);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [showTutorial, setShowTutorial] = useState(false);

  // 初始化游戏
  useEffect(() => {
    if (!gameState) {
      startGame(playerName, battleStyle);
    }
  }, [playerName, battleStyle, gameState, startGame]);

  // 设置当前用户ID
  useEffect(() => {
    if (gameState && !currentUserId) {
      const humanPlayer = gameState.players.find(p => !p.isAI);
      if (humanPlayer) {
        setCurrentUserId(humanPlayer.userId!);
      }
    }
  }, [gameState, currentUserId]);

  // 检查游戏结束
  useEffect(() => {
    if (gameState?.status === "finished") {
      setShowGameCompletion(true);
      // 移除自动倒计时重启 - 让玩家手动选择是否继续
    }
  }, [gameState?.status]);

  // 监听统一的倒转乾坤事件 - 防止重复触发
  useEffect(() => {
    const handleDirectionChange = (event: any) => {
      console.log('🔄 倒转乾坤触发:', event.detail);
      
      // 使用 ref 检查当前状态，避免闭包问题
      if (showDirectionChange) {
        console.log('🔄 倒转乾坤动画正在播放中，忽略重复触发');
        return;
      }
      
      // 启动新动画
      setChangedToDirection(event.detail.direction);
      setShowDirectionChange(true);
    };

    window.addEventListener('gameDirectionChanged', handleDirectionChange);

    return () => {
      window.removeEventListener('gameDirectionChanged', handleDirectionChange);
    };
  }, [showDirectionChange]); // 恢复依赖数组以获得最新状态

  // 错误处理已移至出牌逻辑中的黑色提示框系统

  // 移除自动倒计时 - 现在玩家需要手动选择是否继续

  // 处理出牌
  const handlePlayCard = async (cardId: string) => {
    if (isLoading || !gameState) return;

    const result = await playCard(cardId);
    
    if (result.success) {
      setErrorCount(0); // Reset error count on successful play
      
      // 语音现在直接在Card组件中处理

      // 人类玩家的倒转乾坤现在也通过统一事件处理
    } else if (result.message) {
      // 实现原版黑色错误提示框系统
      const newCount = errorCount + 1;
      setErrorCount(newCount);
      
      if (newCount === 1) {
        toast({
          title: "这张不行",
          variant: "custom",
        });
      } else if (newCount === 2) {
        toast({
          title: "这张也不行",
          variant: "custom",
        });
      } else if (newCount === 3) {
        toast({
          title: "请按台面卡牌颜色出牌",
          variant: "custom",
        });
      } else if (newCount >= 4) {
        setShowTutorial(true);
        setErrorCount(0); // Reset after showing tutorial
      }
    }
  };

  // 处理抽牌
  const handleDrawCard = async () => {
    if (isLoading || !gameState) return;

    const result = await drawCard();
    
    if (!result.success && result.message) {
      toast({
        title: result.message,
        variant: "destructive"
      });
    }
  };

  // 处理AI助手
  const handleAIAssist = async () => {
    if (isLoading || !gameState) return;

    const result = await triggerAIAssist();
    
    if (!result.success && result.message) {
      toast({
        title: result.message,
        variant: "destructive"
      });
    }
  };

  // 玩家活动回调
  const handlePlayerActivity = () => {
    // 本地版本无需上报活动
  };





  // 继续下一轮（普通回合结算）
  const handleContinueGame = () => {
    console.log('🔄 继续游戏处理开始');
    setShowGameCompletion(false);
    startNextRound();
  };

  // 重新开始游戏
  const handleRestartGame = () => {
    console.log('🔄 重新开始游戏');
    setShowGameCompletion(false);
    restartGame();
  };

  // 台面卡牌点击音频现在直接在Card组件中处理



  // 计算胜利消息
  const getVictoryMessage = (): string => {
    if (!gameState) return "";

    const humanPlayer = gameState.players.find(p => !p.isAI);
    if (!humanPlayer || humanPlayer.score <= 0) {
      return "遗憾败北";
    }

    const eliminatedAICount = gameState.players.filter(p => p.isAI && p.score <= 0).length;
    
    switch (eliminatedAICount) {
      case 1: return "小胜一局";
      case 2: return "一箭双雕";
      case 3: return "大杀四方";
      default: return "完美胜利";
    }
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center hexagram-bg">
        <div className="text-white text-xl">正在初始化游戏...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hexagram-bg">
      {/* AI助手计时器 */}
      <LocalAIAssistTimer
        gameState={gameState}
        currentUserId={currentUserId}
        onAIAssist={handleAIAssist}
        onPlayerActivity={handlePlayerActivity}
      />

      {/* 游戏面板 - 前景层 */}
      <div className="relative z-10">
        {/* 八卦动画层 - 在游戏面板内部 */}
        <DirectionChangeNotification
          direction={changedToDirection}
          show={showDirectionChange}
          onHide={handleHideDirectionChange}
        />
        

        
        <GameBoard
          gameState={gameState}
          onPlayCard={handlePlayCard}
          onDrawCard={handleDrawCard}
          onNextRound={handleContinueGame}
          onStartNewGame={handleRestartGame}
          isPlayingCard={isLoading}
          isDrawingCard={isLoading}
          aiActionStatus={gameState.aiActionStatus || ""}
          currentUserId={currentUserId}
          onBackToHome={onBackToHome}
          isLocalGame={true}
        />
      </div>

      {/* 游戏结算模态框 */}
      {showGameCompletion && gameState && (
        <GameCompletionModal
          gameState={gameState}
          onNextRound={handleContinueGame}
          onStartNewGame={handleRestartGame}
          currentUserId={currentUserId}
        />
      )}

      {/* 教程模态框 */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onStartTutorial={() => {
          setShowTutorial(false);
          // 可选：在这里添加开始游戏的逻辑
        }}
      />
    </div>
  );
}