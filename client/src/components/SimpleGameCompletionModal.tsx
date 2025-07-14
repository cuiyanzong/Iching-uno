import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GameState } from '@shared/schema';
import { playVictoryAudio, getVictoryTypeFromResult } from '@/utils/victoryAudio';

interface SimpleGameCompletionModalProps {
  gameState: GameState;
  onNextRound: () => void;
  onStartNewGame?: () => void;
}

export default function SimpleGameCompletionModal({ gameState, onNextRound, onStartNewGame }: SimpleGameCompletionModalProps) {
  const [hasAnnounced, setHasAnnounced] = useState(false);

  // 胜利消息配置
  const winner = gameState.players.find(p => p.cards && p.cards.length === 0);
  const isSpecialEnding = gameState.players.some(p => p.score <= 0);
  
  // 简单的胜利消息
  const getVictoryMessage = () => {
    if (!winner) return "游戏结束";
    
    if (isSpecialEnding) {
      const aiCount = gameState.players.filter(p => p.isAI && p.score > 0).length;
      if (winner.name === "玩家") {
        if (aiCount === 3) return "团灭";
        if (aiCount === 2) return "一箭双雕";
        if (aiCount === 1) return "小胜一局";
      }
      return "遗憾败北";
    }
    
    return `${winner.name} 获胜`;
  };

  // 简单的语音播报
  useEffect(() => {
    if (gameState.status === "finished" && !hasAnnounced) {
      setHasAnnounced(true);
      
      // 仅特殊结算播放音效
      if (isSpecialEnding) {
        const victoryMessage = getVictoryMessage();
        const isPlayerWin = winner?.name === "玩家" || winner?.name === "测试玩家";
        
        setTimeout(() => {
          const victoryType = getVictoryTypeFromResult(victoryMessage, winner?.name || "玩家", isPlayerWin);
          playVictoryAudio(victoryType);
          // console.log(`🎵 特殊结算音效: ${victoryType} (${victoryMessage})`);
        }, 600);
      }
    }
  }, [gameState.status, hasAnnounced]);

  // 简单点击处理
  const handleClick = () => {
    if (isSpecialEnding && onStartNewGame) {
      onStartNewGame();
    } else {
      onNextRound();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md w-full text-center">
        {/* 胜利消息 */}
        <div className="mb-6">
          {isSpecialEnding ? (
            <div className="text-yellow-400 text-3xl font-bold mb-4">
              🏆 {getVictoryMessage()}
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-4">
                {winner?.name || "玩家"} 完美清牌
              </h2>
              <div className="text-gray-300 mb-4">
                {gameState.players.map((player, index) => (
                  <div key={index} className="flex justify-between py-1">
                    <span>{player.name}</span>
                    <span>{player.score}分</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 按钮 */}
        <Button 
          onClick={handleClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg w-full"
        >
          {isSpecialEnding ? "再来一局" : "继续游戏"}
        </Button>
      </div>
    </div>
  );
}