import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import type { GameState } from "@/../../shared/schema";

interface LocalAIAssistTimerProps {
  gameState: GameState | null;
  currentUserId: number | null;
  onAIAssist: () => void;
  onPlayerActivity: () => void;
}

export default function LocalAIAssistTimer({
  gameState,
  currentUserId,
  onAIAssist,
  onPlayerActivity
}: LocalAIAssistTimerProps) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [showCountdown, setShowCountdown] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // 清理定时器
  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 检查是否应该启动AI助手 - 仅针对人类玩家
  const shouldShowTimer = (): boolean => {
    if (!gameState || !currentUserId) return false;
    if (gameState.status !== "playing") return false;

    const currentPlayer = gameState.players[gameState.currentPlayer];
    if (!currentPlayer) return false;

    // 🚫 绝对不能为AI玩家启动
    if (currentPlayer.isAI === true) {
      console.log(`🚫 AI玩家回合 - 不启动AI助手: ${currentPlayer.name}`);
      return false;
    }

    // 必须是人类玩家
    if (currentPlayer.isAI !== false) {
      console.log(`🚫 非人类玩家 - 不启动AI助手: ${currentPlayer.name}`);
      return false;
    }

    // 必须是当前用户的回合
    if (currentPlayer.userId !== currentUserId) {
      console.log(`🚫 非当前用户回合 - 不启动AI助手`);
      return false;
    }

    return true;
  };

  // 启动计时器
  const startTimer = () => {
    clearTimers();
    
    if (!shouldShowTimer()) {
      setIsActive(false);
      return;
    }

    console.log("🔄 启动AI助手计时器 - 仅为人类玩家");
    setIsActive(true);
    startTimeRef.current = Date.now();
    setTimeLeft(15);
    setShowCountdown(false);

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, 15 - elapsed);
      
      setTimeLeft(remaining);

      // 10秒时显示倒计时
      if (remaining <= 10 && remaining > 0) {
        setShowCountdown(true);
      }

      // 时间到达 - 简单触发，不做复杂检查
      if (remaining <= 0) {
        clearTimers();
        console.log("⏰ AI助手时间到达 - 触发操作");
        onAIAssist();
        setIsActive(false);
      }
    }, 200);
  };

  // 重置计时器
  const resetTimer = () => {
    if (isActive && shouldShowTimer()) {
      startTimeRef.current = Date.now();
      setTimeLeft(15);
      setShowCountdown(false);
      onPlayerActivity();
      console.log("🔄 人类玩家活动 - 重置AI助手计时器");
    }
  };

  // 监听游戏状态变化 - 简单逻辑：人类玩家回合启动，AI玩家回合停止
  useEffect(() => {
    if (!gameState || gameState.status !== "playing") {
      clearTimers();
      setIsActive(false);
      return;
    }

    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    // 简单逻辑：AI玩家回合直接停止
    if (currentPlayer?.isAI === true) {
      console.log(`🛑 AI玩家回合 - 停止AI助手: ${currentPlayer.name}`);
      clearTimers();
      setIsActive(false);
      return;
    }

    // 人类玩家回合且是当前用户才启动
    if (currentPlayer?.userId === currentUserId) {
      console.log(`▶️ 人类玩家回合 - 启动AI助手: ${currentPlayer.name}`);
      startTimer();
    } else {
      clearTimers();
      setIsActive(false);
    }

    return () => clearTimers();
  }, [gameState?.currentPlayer, gameState?.status, currentUserId]);

  // 监听玩家活动
  useEffect(() => {
    const handleActivity = () => resetTimer();
    
    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [isActive]);

  // 清理函数
  useEffect(() => {
    return () => clearTimers();
  }, []);

  // 不显示组件的情况
  if (!isActive || !showCountdown) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-orange-500/90 text-white px-3 py-2 rounded-lg shadow-lg animate-pulse">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">
            AI助手 {timeLeft}s
          </span>
        </div>
      </div>
    </div>
  );
}