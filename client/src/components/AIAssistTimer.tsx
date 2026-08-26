import { useEffect, useState } from 'react';
import { Clock, Bot } from 'lucide-react';
// Remove unused import
import type { GameState } from '@shared/schema';

interface AIAssistTimerProps {
  gameState: GameState;
  currentUserId?: number;
  triggerAIAssist?: () => Promise<{ success: boolean; message?: string }>;
}

function AIAssistTimer({ gameState, currentUserId, triggerAIAssist }: AIAssistTimerProps) {
  const [localTimeLeft, setLocalTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);

  // 检查是否应该显示AI助手计时器 - 全覆盖显示模式
  const targetPlayer = gameState?.aiAssistant?.targetPlayerId !== undefined ? 
    gameState?.players?.[gameState.aiAssistant.targetPlayerId] : undefined;
  const isZombiePlayer = targetPlayer && !targetPlayer.socketId && targetPlayer.isAI !== true;
  
  const shouldShowTimer = gameState?.aiAssistant?.active &&
                         gameState?.status === "playing" &&
                         targetPlayer && 
                         (targetPlayer.userId === currentUserId || isZombiePlayer);

  // 检查当前用户是否为目标玩家（用于权限控制）
  const isCurrentUserTargeted = targetPlayer?.userId === currentUserId;

  // 触发AI助手 - 使用传入的函数
  const handleAIAssist = async () => {
    if (!triggerAIAssist || !currentUserId || isTriggering) return;
    
    // 如果AI助手已经在工作，不重复触发
    if (gameState?.aiAssistant?.isAssisting) return;
    
    setIsTriggering(true);
    
    try {
      console.log('🤖 触发AI助手通过钩子函数');
      const result = await triggerAIAssist();
      
      if (result.success) {
        // AI助手触发成功，停止倒计时
        setTimerActive(false);
        console.log('✅ AI助手触发成功:', result.message);
      } else {
        console.error('❌ AI助手触发失败:', result.message);
      }
    } catch (error) {
      console.error('Failed to trigger AI assist:', error);
    } finally {
      // 延迟重置触发状态，避免快速重复点击
      setTimeout(() => setIsTriggering(false), 2000);
    }
  };

  // 本地倒计时管理
  useEffect(() => {
    if (shouldShowTimer && !timerActive) {
      // AI助手启动时，开始本地15秒倒计时
      setLocalTimeLeft(15);
      setTimerActive(true);
    } else if (!shouldShowTimer && timerActive) {
      // AI助手停止时，停止本地倒计时
      setTimerActive(false);
    }
  }, [shouldShowTimer, timerActive]);

  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setLocalTimeLeft(prev => {
        if (prev <= 1) {
          // 倒计时结束，触发AI助手（只有在未触发状态下才执行）
          if (!isTriggering && !gameState?.aiAssistant?.isAssisting) {
            setTimerActive(false);
            handleAIAssist();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, gameState?.id, currentUserId]);
  
  // 当前操作的玩家信息
  const currentPlayer = gameState?.players?.[gameState?.currentPlayer];
  const currentPlayerName = currentPlayer?.name || "玩家";

  // 显示AI助手正在辅助状态
  if (gameState?.aiAssistant?.isAssisting) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-blue-500/90 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <Bot className="h-5 w-5 animate-spin" />
        <div className="text-sm font-medium">
          {isCurrentUserTargeted ? "AI正在帮助您出牌..." : `AI正在帮助 ${currentPlayerName} 出牌...`}
        </div>
      </div>
    );
  }

  // 显示倒计时警告 - 使用本地倒计时
  if (shouldShowTimer && timerActive && localTimeLeft > 0) {
    const formatTime = (seconds: number) => seconds.toString();
    
    return (
      <div className="fixed top-4 right-4 z-50 bg-orange-500/90 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
        <Clock className="h-5 w-5" />
        <div className="text-sm font-medium">
          {isCurrentUserTargeted ? (
            `AI将在 ${formatTime(localTimeLeft)} 秒后帮助您出牌`
          ) : (
            `AI将在 ${formatTime(localTimeLeft)} 秒后帮助 ${currentPlayerName} 出牌`
          )}
        </div>
        {isCurrentUserTargeted && (
          <button
            onClick={handleAIAssist}
            disabled={isTriggering || gameState?.aiAssistant?.isAssisting}
            className="ml-2 px-2 py-1 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed rounded text-xs transition-colors"
          >
            {isTriggering ? "触发中..." : "立即辅助"}
          </button>
        )}
      </div>
    );
  }

  return null;
}

export default AIAssistTimer;