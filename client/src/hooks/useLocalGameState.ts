/**
 * 本地游戏状态管理 Hook
 * 替代useSimpleGameState，管理单机版游戏状态
 */

import { useState, useEffect, useRef } from "react";
import type { GameState, BattleStyle } from "@shared/schema";
import { LocalGameEngine, type GameResult } from "@/core/LocalGameEngine";
import { initializePlayerScore } from "@/utils/permanentScores";

export interface LocalGameStateResult {
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  playCard: (cardId: string) => Promise<{ success: boolean; message?: string }>;
  drawCard: () => Promise<{ success: boolean; message?: string }>;
  triggerAIAssist: () => Promise<{ success: boolean; message?: string }>;
  useSkill: (element: string) => Promise<{ success: boolean; message?: string }>;
  startGame: (playerName: string, battleStyle?: BattleStyle | null) => void;
  restartGame: () => void;
  startNextRound: () => void;
}

export function useLocalGameState(): LocalGameStateResult {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const gameEngineRef = useRef<LocalGameEngine | null>(null);

  // 初始化游戏引擎和状态监听
  useEffect(() => {
    const engine = new LocalGameEngine();
    gameEngineRef.current = engine;
    
    // 监听游戏状态更新
    const handleGameUpdate = (event: CustomEvent) => {
      console.log(`🔄 状态更新事件接收:`, event.detail?.currentCard, event.detail?.aiActionStatus);
      setGameState({ ...event.detail }); // 强制创建新对象触发重渲染
    };

    engine.addEventListener('gameStateUpdate', handleGameUpdate);
    
    // 立即获取初始状态
    const initialState = engine.getGameState();
    if (initialState) {
      setGameState({ ...initialState });
    }

    return () => {
      engine.removeEventListener('gameStateUpdate', handleGameUpdate);
    };
  }, []); // 保持空依赖，但确保cleanup正确执行

  // 开始游戏
  const startGame = (playerName: string, battleStyle?: BattleStyle | null) => {
    if (!gameEngineRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // 初始化玩家积分记录
      initializePlayerScore(playerName);
      
      const newGameState = gameEngineRef.current.createGame(playerName, battleStyle);
      setGameState(newGameState);
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建游戏失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 玩家出牌
  const playCard = async (cardId: string) => {
    if (!gameEngineRef.current) {
      return { success: false, message: "游戏引擎未初始化" };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await gameEngineRef.current.playCard(cardId);
      
      if (!result.success && result.message) {
        setError(result.message);
      }

      return {
        success: result.success,
        message: result.message
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "出牌失败";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // 玩家抽牌
  const drawCard = async () => {
    if (!gameEngineRef.current) {
      return { success: false, message: "游戏引擎未初始化" };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await gameEngineRef.current.drawCard();
      
      if (!result.success && result.message) {
        setError(result.message);
      }

      return {
        success: result.success,
        message: result.message
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "抽牌失败";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // 触发AI助手
  const triggerAIAssist = async () => {
    if (!gameEngineRef.current) {
      return { success: false, message: "游戏引擎未初始化" };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await gameEngineRef.current.triggerAIAssist();
      
      if (!result.success && result.message) {
        setError(result.message);
      }

      return {
        success: result.success,
        message: result.message
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "AI助手触发失败";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // 重新开始游戏
  const restartGame = () => {
    if (!gameEngineRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      gameEngineRef.current.restartGame();
    } catch (err) {
      setError(err instanceof Error ? err.message : "重新开始游戏失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 使用技能
  const useSkill = async (element: string) => {
    if (!gameEngineRef.current) {
      return { success: false, message: "游戏引擎未初始化" };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await gameEngineRef.current.useSkill(element);
      
      if (!result.success && result.message) {
        setError(result.message);
      }

      return {
        success: result.success,
        message: result.message
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "技能使用失败";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // 开始下一轮游戏
  const startNextRound = () => {
    if (!gameEngineRef.current) return;

    console.log('🔄 开始下一轮 - 调用游戏引擎');
    try {
      gameEngineRef.current.startNextRound();
    } catch (err) {
      setError(err instanceof Error ? err.message : "开始下一轮失败");
    }
  };

  return {
    gameState,
    isLoading,
    error,
    playCard,
    drawCard,
    triggerAIAssist,
    useSkill,
    startGame,
    restartGame,
    startNextRound
  };
}