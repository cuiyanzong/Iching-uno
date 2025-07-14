import { Button } from "@/components/ui/button";
import { Card as UICard } from "@/components/ui/card";
// 移除Input和AlertDialog导入 - 不再需要手动上传功能

import type { GameState } from "@shared/schema";
import { useState, useEffect } from "react";
import { queryClient } from "@/lib/queryClient";
import { 
  calculatePermanentScoreChanges, 
  applyPermanentScoreChanges, 
  getPermanentScores,
  type PermanentScoreChange 
} from "@/utils/permanentScores";
import ScoreChangeAnimation from "./ScoreChangeAnimation";
// 移除手动上传相关的导入 - 现在使用自动上传功能
import { tryAutoUploadPlayer } from "@/utils/autoUpload";
import { playVictoryAudio, getVictoryTypeFromResult } from "@/utils/victoryAudio";

interface GameCompletionModalProps {
  gameState: GameState;
  onNextRound: () => void;
  onStartNewGame?: () => void;
  currentUserId?: number;
  onSyncRefresh?: () => Promise<void>;
  resetWebSocketState?: () => void;
}

export default function GameCompletionModal({ gameState, onNextRound, onStartNewGame, currentUserId, onSyncRefresh, resetWebSocketState }: GameCompletionModalProps) {
  const [hasAnnounced, setHasAnnounced] = useState(false);
  const [countdown, setCountdown] = useState<number>(30);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scoreChanges, setScoreChanges] = useState<PermanentScoreChange[]>([]);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);

  // Announce game completion - 修复React重新渲染问题
  useEffect(() => {
    if (gameState.status === "finished" && !hasAnnounced) {
      // 使用setTimeout避免在渲染期间调用setState
      setTimeout(() => {
        setHasAnnounced(true);
        
        // 计算积分变化并立即保存
        console.log('🎯 游戏结束，计算积分变化...');
        const changes = calculatePermanentScoreChanges(gameState);
        console.log('💰 积分变化计算完成:', changes);
        
        // 🔑 关键修复：立即应用积分变化到localStorage
        if (changes.length > 0) {
          console.log('📝 保存积分变化到localStorage...');
          applyPermanentScoreChanges(changes);
          console.log('✅ 积分变化已保存到localStorage');
          
          // 🔑 关键修复：积分保存完成后立即触发自动上传（优化版）
          console.log('📤 开始立即上传到排行榜...');
          changes.forEach(change => {
            if (change.playerId.startsWith('human_')) {
              console.log(`📤 立即上传玩家: ${change.playerName}`);
              // 不等待，立即触发上传
              tryAutoUploadPlayer(change.playerName).then(success => {
                if (success) {
                  console.log(`✅ ${change.playerName} 立即上传成功`);
                } else {
                  console.log(`📋 ${change.playerName} 已添加到待上传队列`);
                }
              }).catch(error => {
                console.error(`❌ ${change.playerName} 立即上传失败:`, error);
              });
            }
          });
        }
        
        setScoreChanges(changes);
        
        // 延迟显示积分动画
        setTimeout(() => {
          setShowScoreAnimation(true);
        }, 500);
      }, 0);
    }
  }, [gameState.status, hasAnnounced, gameState]);



  // 简单清理
  const performFrontendCleanup = () => {
    setHasAnnounced(false);
  };

  // 继续游戏处理 - 带准备按钮功能
  const handleReady = async () => {
    console.log(`🔄 点击准备按钮 - 特殊结算: ${isSpecialEnding}`);
    setIsLoading(true);
    
    // 单机游戏模式：直接本地处理，不发送网络请求
    console.log('🎮 单机游戏模式：直接本地处理');
    
    try {
      // 执行前端清理
      performFrontendCleanup();
      
      // 根据游戏状态选择处理方式
      if (isSpecialEnding) {
        console.log('🎮 特殊结算：重新开始游戏');
        if (onStartNewGame) {
          onStartNewGame();
        }
      } else {
        console.log('🎮 普通结算：继续下一轮');
        onNextRound();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('本地处理失败:', error);
      setIsLoading(false);
    }
  };

  if (gameState.status !== "finished") return null;

  // 检查是否是特殊结算（有玩家分数归零）
  const eliminatedPlayers = gameState.players.filter(p => p.score <= 0);
  const isSpecialEnding = eliminatedPlayers.length > 0;

  // 移除重复的积分计算 - 已在上面的 useEffect 中处理

  // Find the round winner (player who finished their cards first)
  const roundWinner = gameState.players.find(player => player.cards.length === 0);
  
  // Use the current scores (already deducted in server)
  const playersWithScores = gameState.players.map(player => ({
    ...player,
    finalScore: player.score,
    cardsRemaining: player.cards.length
  })).sort((a, b) => b.finalScore - a.finalScore);

  const winner = roundWinner ? playersWithScores.find(p => p.id === roundWinner.id)! : playersWithScores[0];

  // Find the current user's player and other players
  const currentUserPlayer = playersWithScores.find(p => p.userId === currentUserId || p.id === currentUserId);
  
  let resultMessage = "";
  let victoryPlayer = null;
  
  if (isSpecialEnding) {
    // Find the winner (player with highest positive score)
    const specialWinner = playersWithScores.find(p => p.finalScore > 0);
    if (specialWinner) {
      victoryPlayer = specialWinner;
      const defeatedCount = eliminatedPlayers.length;
      
      // Determine victory message based on number of defeated players
      if (defeatedCount >= 3) {
        resultMessage = "大杀四方";
      } else if (defeatedCount === 2) {
        resultMessage = "一箭双雕";
      } else if (defeatedCount >= 1) {
        resultMessage = "小胜一局";
      }
    }
    
    // 调试信息
    console.log('🏆 胜利判断调试:', {
      isSpecialEnding,
      eliminatedPlayers: eliminatedPlayers.map(p => ({ name: p.name, score: p.score })),
      defeatedCount: eliminatedPlayers.length,
      specialWinner: specialWinner ? { name: specialWinner.name, score: specialWinner.finalScore } : null,
      victoryPlayer: victoryPlayer ? { name: victoryPlayer.name, score: victoryPlayer.finalScore } : null,
      resultMessage,
      willShowVictoryUI: !!(victoryPlayer && resultMessage)
    });
  }

  // Play victory message voice when modal appears (special ending only)
  useEffect(() => {
    if (isSpecialEnding && gameState.status === "finished") {
      const timer = setTimeout(() => {
        if (victoryPlayer && resultMessage) {
          const message = `${victoryPlayer.name}${resultMessage}`;
          console.log(`Victory message: ${message}`);
          
          // 播放胜利音效
          const isPlayerWin = currentUserPlayer && currentUserPlayer.id === victoryPlayer.id;
          const victoryType = getVictoryTypeFromResult(resultMessage, victoryPlayer.name, !!isPlayerWin);
          playVictoryAudio(victoryType);
        } else if (currentUserPlayer && currentUserPlayer.finalScore <= 0) {
          console.log("Defeat message: 遗憾败北");
          
          // 播放失败音效
          playVictoryAudio('defeat');
        }
      }, 800); // Delay to ensure modal is fully rendered
      
      return () => clearTimeout(timer);
    }
  }, [isSpecialEnding, gameState.status]); // Remove dependencies that cause re-renders

  // 倒计时逻辑
  useEffect(() => {
    if (!isCountdownActive) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // 倒计时结束，自动开始下一轮
          setIsCountdownActive(false);
          handleNextAction();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountdownActive]);

  // 同步倒计时状态
  useEffect(() => {
    if (onSyncRefresh) {
      const syncTimer = setInterval(() => {
        onSyncRefresh();
      }, 2000); // 每2秒同步一次状态

      return () => clearInterval(syncTimer);
    }
  }, [onSyncRefresh]);



  const handleNextAction = () => {
    setIsLoading(true);
    
    if (isSpecialEnding) {
      console.log("🎯 特殊结算：重新开始游戏");
      // For special endings, restart with reset scores
      if (onStartNewGame) {
        onStartNewGame();
      }
    } else {
      console.log("🎯 回合结算：继续下一轮");
      // For normal round completion, continue next round
      onNextRound();
    }
  };

  // 手动上传相关的函数已删除，现在使用自动上传功能

  // 只在游戏结束时显示模态框
  if (gameState.status !== "finished") {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <UICard className="bg-gray-800 border-gray-600 p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center">
          {isSpecialEnding ? (
            <>
              <div className="mb-8">
                {/* Show defeat message if current player has zero or negative score */}
                {currentUserPlayer && currentUserPlayer.finalScore <= 0 && !victoryPlayer && (
                  <div className="text-3xl font-bold text-yellow-400 mb-6">
                    遗憾败北
                  </div>
                )}
                
                {/* Show victory message based on defeats */}
                {victoryPlayer && resultMessage && (
                  <>
                    <div className="text-3xl font-bold text-yellow-400 mb-6">
                      🏆 {victoryPlayer.name}{resultMessage}
                    </div>
                    

                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-6">回合结束!</h2>
              
              <div className="mb-6">
                <div className="text-lg text-yellow-400 mb-2">
                  🏆 本轮胜利者
                </div>
                <div className="text-xl font-bold text-white">{winner.name}</div>
                <div className="text-sm text-gray-300">
                  {winner.cardsRemaining === 0 ? "完美清牌！" : `最终得分: ${winner.finalScore}分`}
                </div>
              </div>
            </>
          )}

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">分数结算</h3>
            <div className="space-y-2">
              {playersWithScores.map((player, index) => {
                const playerId = player.isAI ? `ai_${player.id}` : `human_${player.name}`;
                const scoreChange = scoreChanges.find(c => c.playerId === playerId);
                const permanentScores = getPermanentScores();
                const playerPermanentData = permanentScores[playerId];
                
                // 确保显示正确的积分变化
                const oldScore = scoreChange ? scoreChange.oldScore : (playerPermanentData?.totalScore || 0);
                const newScore = scoreChange ? scoreChange.newScore : (playerPermanentData?.totalScore || 0);
                const actualChange = scoreChange ? scoreChange.change : 0;
                
                // 调试信息
                if (isSpecialEnding) {
                  console.log(`🔍 玩家 ${player.name} 积分调试:`, {
                    playerId,
                    scoreChange,
                    playerPermanentData,
                    oldScore,
                    newScore,
                    actualChange
                  });
                }
                
                return (
                  <div key={player.id} className="relative flex justify-between items-center bg-gray-700 rounded px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">#{index + 1}</span>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-1">
                          <span className="text-white font-medium">{player.name}</span>
                          {(player.userId === currentUserId || player.id === currentUserId) && <span className="text-blue-400 text-xs">(你)</span>}
                        </div>
                        {/* 显示永久积分情况 */}
                        <div className="text-xs">
                          {player.isAI ? (
                            (() => {
                              const permanentScores = getPermanentScores();
                              const playerData = permanentScores[`ai_${player.id}`];
                              const totalScore = playerData?.totalScore || 0;
                              return (
                                <span className={totalScore > 0 ? "text-yellow-400" : "text-gray-400"}>
                                  总积分: {totalScore} | 胜{playerData?.wins || 0}负{playerData?.defeats || 0}
                                </span>
                              );
                            })()
                          ) : (
                            (() => {
                              const permanentScores = getPermanentScores();
                              const playerData = permanentScores[`human_${player.name}`];
                              const totalScore = playerData?.totalScore || 0;
                              return (
                                <span className={totalScore > 0 ? "text-yellow-400" : "text-gray-400"}>
                                  总积分: {totalScore} | 胜{playerData?.wins || 0}负{playerData?.defeats || 0}
                                </span>
                              );
                            })()
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* 积分动画 - 放在中间位置 */}
                    {actualChange !== 0 && (
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <ScoreChangeAnimation
                          oldScore={oldScore}
                          change={actualChange}
                          newScore={newScore}
                          show={showScoreAnimation}
                          className="relative"
                        />
                      </div>
                    )}
                    
                    <div className="text-right">
                      <div className="text-white font-bold">{player.finalScore}分</div>
                      <div className="text-xs text-gray-400">
                        {player.cardsRemaining > 0 ? `剩余${player.cardsRemaining}张牌(-${player.cardsRemaining * 10}分)` : "清牌完成"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Combined Countdown and Ready Button */}
          <div className="space-y-4">
            {/* Player Ready Status (if multiple players) */}
            {gameState.players.filter(p => !p.isAI).length > 1 && (
              <div className="text-center p-3 bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-300 mb-2">准备状态</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {gameState.players.filter(p => !p.isAI).map(player => (
                    <div key={player.id} className="flex items-center space-x-1">
                      <span className="text-white text-sm">{player.name}</span>
                      <span className={`w-2 h-2 rounded-full ${player.isReady ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            


            {/* Combined Ready Button with Countdown */}
            <div className="text-center">
              <Button 
                onClick={handleReady}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg w-full min-h-[80px] flex flex-col items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>处理中...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-xl font-bold">
                      {isSpecialEnding ? "再来一局" : "继续游戏"}
                    </div>
                    {isCountdownActive && (
                      <div className="text-sm text-blue-300 mt-1">
                        {countdown}秒后自动开始
                      </div>
                    )}
                  </>
                )}
              </Button>
              
              {/* Explanation text */}
              <div className="text-sm text-gray-400 mt-2">
                {gameState.players.filter(p => !p.isAI).length > 1 
                  ? "点击准备或等待倒计时结束自动开始" 
                  : "倒计时结束后自动开始下一局"
                }
              </div>
            </div>
          </div>
        </div>
      </UICard>

      {/* 手动上传对话框已删除 - 现在使用自动上传功能 */}
    </div>
  );
}