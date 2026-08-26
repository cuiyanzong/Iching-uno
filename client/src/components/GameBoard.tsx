import { Button } from "@/components/ui/button";
import { Card as UICard } from "@/components/ui/card";
import PlayerArea from "./PlayerArea";
import CentralArea from "./CentralArea";
import GameCompletionModal from "./GameCompletionModal";
// DirectionChangeNotification 已移动到父组件处理
import VoiceSelector from "./VoiceSelector";
import SkillContainer from "./SkillContainer";
import SkillAnimation from "./SkillAnimation";

import { Volume2, VolumeX, RefreshCw, Home } from "lucide-react";

import type { GameState, Element } from "@shared/schema";
import { useState, useEffect, memo } from "react";
import { audioManager } from "@/lib/localAudio";

interface GameBoardProps {
  gameState: GameState;
  onPlayCard: (cardId: string) => void;
  onDrawCard: () => void;
  onNextRound: () => void;
  onStartNewGame?: () => void;
  isPlayingCard: boolean;
  isDrawingCard: boolean;
  aiActionStatus?: string;
  currentUserId?: number;
  onSyncRefresh?: () => Promise<void>;
  resetWebSocketState?: () => void;
  onBackToHome?: () => void;
  isLocalGame?: boolean;
  // 技能系统相关
  battleStyle?: string;
  onSkillTrigger?: (element: Element) => void;
}

export default memo(function GameBoard({
  gameState,
  onPlayCard,
  onDrawCard,
  onNextRound,
  onStartNewGame,
  isPlayingCard,
  isDrawingCard,
  aiActionStatus = "",
  currentUserId = 1,
  onSyncRefresh,
  resetWebSocketState,
  onBackToHome,
  isLocalGame = false,
  battleStyle,
  onSkillTrigger,
}: GameBoardProps) {

  // Helper function to get player position based on player index
  const getPlayerPosition = (playerId: number): 'top' | 'left' | 'right' | 'bottom' => {
    const playerIndex = gameState.players.findIndex(p => p.id === playerId);
    // 正确的位置映射：索引0=bottom, 索引1=right, 索引2=top, 索引3=left
    const positions: ('top' | 'left' | 'right' | 'bottom')[] = ['bottom', 'right', 'top', 'left'];
    return positions[playerIndex] || 'bottom';
  };
  const currentPlayer = gameState.players[gameState.currentPlayer];
  // Find the user's player
  const userPlayer = gameState.players.find(
    (p) => p.userId === currentUserId || (!p.isAI && p.id === currentUserId),
  );
  // Check if it's the user's turn
  const isUserTurn =
    currentPlayer && userPlayer && currentPlayer.id === userPlayer.id;

  // Get user player index for relative positioning
  const userPlayerIndex = gameState.players.findIndex(
    (p) => p.id === userPlayer?.id,
  );

  // Arrange players relative to user (user always at bottom)
  const getRelativePlayer = (offset: number) => {
    if (userPlayerIndex === -1) return null;
    const index = (userPlayerIndex + offset) % gameState.players.length;
    return gameState.players[index];
  };

  // Get players for each position relative to user
  const topPlayer = getRelativePlayer(2); // Player opposite to user
  const leftPlayer = getRelativePlayer(3); // Player to user's left
  const rightPlayer = getRelativePlayer(1); // Player to user's right

  // 方向变化通知由父组件处理，这里不重复处理

  // Audio state
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Skill animation state
  const [skillAnimationData, setSkillAnimationData] = useState<{
    isActive: boolean;
    element: Element | null;
    consumedCards: string[];
    animationKey: number;
    sourcePosition: 'top' | 'left' | 'right' | 'bottom';
  }>({
    isActive: false,
    element: null,
    consumedCards: [],
    animationKey: 0,
    sourcePosition: 'bottom'
  });

  useEffect(() => {
    // 监听技能使用事件
    const handleSkillUsed = (event: CustomEvent) => {
      const { element, cardIds, playerId } = event.detail;
      console.log('🎭 收到技能使用事件:', element, cardIds, 'playerId:', playerId);
      
      // 🔊 播放技能语音（包括AI玩家）
      audioManager.playSkillAudio(element);
      console.log(`🔊 播放技能语音: ${element} (${audioManager.getVoice()})`);
      
      // 获取触发技能的玩家位置
      const sourcePosition = playerId ? getPlayerPosition(playerId) : 'bottom';
      console.log('🎭 技能源位置:', sourcePosition);
      
      setSkillAnimationData(prev => ({
        isActive: true,
        element,
        consumedCards: cardIds,
        animationKey: prev.animationKey + 1,
        sourcePosition
      }));
    };

    // 监听强制清理动画事件
    const handleClearAnimation = () => {
      console.log('🎭 强制清理技能动画状态');
      setSkillAnimationData({
        isActive: false,
        element: null,
        consumedCards: [],
        animationKey: 0,
        sourcePosition: 'bottom'
      });
    };

    window.addEventListener('skillUsed', handleSkillUsed as EventListener);
    window.addEventListener('clearSkillAnimation', handleClearAnimation as EventListener);
    
    return () => {
      window.removeEventListener('skillUsed', handleSkillUsed as EventListener);
      window.removeEventListener('clearSkillAnimation', handleClearAnimation as EventListener);
    };
  }, []);

  useEffect(() => {
    // 音频现在直接在Card组件中处理
    setAudioEnabled(true);
  }, []);

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    // 音频开关现在可以通过上下文或其他方式管理
  };

  // 方向变化检测已移除，由父组件LocalGame.tsx统一处理

  // Handle back to home for local game
  const handleBackToHome = () => {
    if (isLocalGame && onBackToHome) {
      if (confirm('确定要返回首页吗？当前游戏进度将丢失。')) {
        onBackToHome();
      }
    } else {
      // For other games, keep the refresh functionality
      if (confirm('确定要刷新页面吗？这将重新加载游戏界面。')) {
        sessionStorage.removeItem('pageState');
        sessionStorage.removeItem('tempData');
        window.location.reload();
      }
    }
  };

  return (
    <div className="h-screen text-white overflow-hidden relative hexagram-bg">
      {/* Back to Home / Refresh Button - Top Left */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          onClick={handleBackToHome}
          variant="outline"
          size="sm"
          className="bg-black/20 border-white/30 text-white hover:bg-white/10 hover:border-white/50"
          title={isLocalGame ? "返回首页" : "刷新页面"}
        >
          {isLocalGame ? <Home className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </div>

      {/* Voice Selector - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <VoiceSelector />
      </div>

      <div className="h-screen flex items-center justify-center p-2 sm:p-4 md:p-6 relative z-10">
        {/* Top Player */}
        {topPlayer && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 skill-position-top">
            <PlayerArea
              player={topPlayer}
              position="top"
              isCurrentPlayer={
                gameState.currentPlayer ===
                gameState.players.findIndex((p) => p.id === topPlayer.id)
              }
            />

          </div>
        )}

        {/* Left Player */}
        {leftPlayer && (
          <div className="absolute left-1 sm:left-2 md:left-4 lg:left-6 top-1/2 transform -translate-y-1/2 skill-position-left">
            <PlayerArea
              player={leftPlayer}
              position="left"
              isCurrentPlayer={
                gameState.currentPlayer ===
                gameState.players.findIndex((p) => p.id === leftPlayer.id)
              }
            />

          </div>
        )}

        {/* Right Player */}
        {rightPlayer && (
          <div className="absolute right-1 sm:right-2 md:right-4 lg:right-6 top-1/2 transform -translate-y-1/2 skill-position-right">
            <PlayerArea
              player={rightPlayer}
              position="right"
              isCurrentPlayer={
                gameState.currentPlayer ===
                gameState.players.findIndex((p) => p.id === rightPlayer.id)
              }
            />

          </div>
        )}

        {/* Central Game Area - Moved Up */}
        <div className="flex-1 max-w-lg mx-4 sm:mx-6 md:mx-8 -mt-16">
          {/* 方向变化通知已移动到父组件LocalGame.tsx */}

          {/* Centered Card Area */}
          <div className="flex flex-col items-center space-y-2 sm:space-y-3">
            <CentralArea
              currentCard={gameState.currentCard}
              deckCount={gameState.deck.length}
            />

            {/* Draw Button - Moved to center area */}
            <Button
              onClick={onDrawCard}
              disabled={!isUserTurn || isDrawingCard}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
            >
              {isDrawingCard ? "抽牌中..." : "抽牌"}
            </Button>
            
            {/* AI Action Status */}
            {aiActionStatus && (
              <div className="mt-3">
                <span className="text-yellow-400 font-medium">
                  {aiActionStatus}
                </span>
              </div>
            )}

            {/* Current Player Status Indicator */}
            {!aiActionStatus && (
              <div className="text-center">
                {isUserTurn ? (
                  <div className="text-green-400 font-medium animate-pulse">
                    轮到你了！
                  </div>
                ) : currentPlayer?.isAI ? (
                  <div className="text-yellow-400 font-medium">
                    {currentPlayer?.name}思考中...
                  </div>
                ) : (
                  <div className="text-blue-400 font-medium">
                    等待{currentPlayer?.name}出牌...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Player - Show current user's player */}
        <div className="absolute bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-2 sm:px-4 md:px-6 skill-position-bottom">
          {userPlayer && (
            <>
              <PlayerArea
                player={userPlayer}
                position="bottom"
                isCurrentPlayer={
                  gameState.currentPlayer ===
                  gameState.players.findIndex((p) => p.id === userPlayer.id)
                }
                onPlayCard={onPlayCard}
                isPlayingCard={isPlayingCard}
              />

              {/* Player info below cards */}
              <div className="text-center mt-3">
                <div className="flex items-center justify-center space-x-3">
                  <span
                    className={`text-sm font-semibold ${gameState.currentPlayer === gameState.players.findIndex((p) => p.id === userPlayer.id) ? "text-blue-400" : "text-gray-300"}`}
                  >
                    {userPlayer.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {userPlayer.score}分
                  </span>
                </div>
                
                {/* 技能容器 - 在玩家名字下方 */}
                {gameState.currentCard && onSkillTrigger && (
                  <div className="mt-2 flex justify-center">
                    <SkillContainer
                      playerCards={userPlayer.cards || []}
                      currentCard={gameState.currentCard}
                      onSkillTrigger={onSkillTrigger}
                      isPlayerTurn={
                        gameState.currentPlayer ===
                        gameState.players.findIndex((p) => p.id === userPlayer.id)
                      }
                      disabled={isPlayingCard || isDrawingCard}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Skill Animation Overlay */}
      {skillAnimationData.element && skillAnimationData.isActive && (
        <SkillAnimation
          key={skillAnimationData.animationKey}
          isVisible={skillAnimationData.isActive}
          skillName=""
          element={skillAnimationData.element}
          cardIds={skillAnimationData.consumedCards}
          sourcePosition={skillAnimationData.sourcePosition}
          onComplete={() => {
            console.log('🎭 技能动画完成，重置状态');
            setSkillAnimationData({
              isActive: false,
              element: null,
              consumedCards: [],
              animationKey: 0,
              sourcePosition: 'bottom'
            });
          }}
        />
      )}

      {/* Game Completion Modal - Removed, handled by parent component */}
      {/* 
      {gameState.status === "finished" && (
        <GameCompletionModal
          gameState={gameState}
          onNextRound={onNextRound}
          onStartNewGame={onStartNewGame}
          currentUserId={currentUserId}
          onSyncRefresh={onSyncRefresh}
          resetWebSocketState={resetWebSocketState}
        />
      )}
      */}
    </div>
  );
});
