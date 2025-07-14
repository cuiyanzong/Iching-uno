import Card from "./Card";

interface CentralAreaProps {
  currentCard: string | null;
  deckCount: number;
}

export default function CentralArea({ currentCard, deckCount }: CentralAreaProps) {
  // 音频播放现在直接在Card组件内部处理
  
  // 检测APP环境 - 只在真正的APP中使用小尺寸
  const isCapacitorApp = !!(window as any).Capacitor || 
                        !!(window as any).cordova || 
                        navigator.userAgent.includes('capacitor') ||
                        window.location.protocol === 'file:';
  
  // 检测真实的移动设备（排除桌面浏览器模拟）
  const isRealMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
                           !navigator.userAgent.includes('Chrome') ||
                           (navigator.userAgent.includes('Mobile') && !navigator.userAgent.includes('Windows'));
  
  // 只在APP环境中使用medium尺寸，浏览器始终使用large
  const cardSize = isCapacitorApp ? "medium" : "large";
  
  // 根据环境调整间距和堆叠效果  
  const spacing = isCapacitorApp ? "space-x-3" : "space-x-6 md:space-x-8";
  const stackShadowSize = isCapacitorApp ? "w-16 h-24" : "w-20 h-28";
  const emptyCardSize = isCapacitorApp ? "w-16 h-24" : "w-20 h-28";
  
  // 调试信息
  console.log('环境检测:', {
    isCapacitorApp,
    isRealMobileDevice,
    cardSize,
    userAgent: navigator.userAgent,
    windowSize: `${window.innerWidth}x${window.innerHeight}`,
    protocol: window.location.protocol,
    hostname: window.location.hostname
  });

  return (
    <div className={`flex items-end justify-center ${spacing}`}>
      {/* Draw Pile - Aligned */}
      <div className="flex flex-col items-center">
        <div className="relative drop-shadow-2xl">
          <Card cardId="" size={cardSize} showBack />
          {/* Stack effect - 调整为适应不同尺寸 */}
          <div className={`absolute -top-1 -left-1 ${stackShadowSize} bg-blue-800/40 rounded-lg -z-10 shadow-xl`}></div>
          <div className={`absolute -top-2 -left-2 ${stackShadowSize} bg-blue-700/30 rounded-lg -z-20 shadow-lg`}></div>
        </div>
        <div className="mt-1 text-xs text-gray-400">牌堆 ({deckCount})</div>
      </div>

      {/* Current Card - Aligned with deck */}
      <div className="flex flex-col items-center">
        <div className="drop-shadow-2xl">
          {currentCard ? (
            <Card 
              cardId={currentCard} 
              size={cardSize} 
              className="cursor-pointer hover:scale-105 transition-transform duration-[20ms]"
            />
          ) : (
            <div className={`${emptyCardSize} bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center shadow-2xl`}>
              <span className="text-gray-500 text-xs">无牌</span>
            </div>
          )}
        </div>
        <div className="mt-1 text-xs text-gray-400">台面</div>
      </div>
    </div>
  );
}
