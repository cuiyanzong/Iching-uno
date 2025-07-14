import Card from "./Card";

interface CentralAreaProps {
  currentCard: string | null;
  deckCount: number;
}

export default function CentralArea({ currentCard, deckCount }: CentralAreaProps) {
  // 音频播放现在直接在Card组件内部处理

  return (
    <div className="flex items-end justify-center space-x-6 md:space-x-8">
      {/* Draw Pile - Aligned */}
      <div className="flex flex-col items-center">
        <div className="relative drop-shadow-2xl">
          <Card cardId="" size="large" showBack />
          {/* Stack effect */}
          <div className="absolute -top-1 -left-1 w-20 h-28 bg-blue-800/40 rounded-lg -z-10 shadow-xl"></div>
          <div className="absolute -top-2 -left-2 w-20 h-28 bg-blue-700/30 rounded-lg -z-20 shadow-lg"></div>
        </div>
        <div className="mt-1 text-xs text-gray-400">牌堆 ({deckCount})</div>
      </div>

      {/* Current Card - Aligned with deck */}
      <div className="flex flex-col items-center">
        <div className="drop-shadow-2xl">
          {currentCard ? (
            <Card 
              cardId={currentCard} 
              size="large" 
              className="cursor-pointer hover:scale-105 transition-transform duration-[20ms]"
            />
          ) : (
            <div className="w-20 h-28 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center shadow-2xl">
              <span className="text-gray-500 text-xs">无牌</span>
            </div>
          )}
        </div>
        <div className="mt-1 text-xs text-gray-400">台面</div>
      </div>
    </div>
  );
}
