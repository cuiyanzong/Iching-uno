import Card from "./Card";

interface CentralAreaProps {
  currentCard: string | null;
  deckCount: number;
}

export default function CentralArea({ currentCard, deckCount }: CentralAreaProps) {
  // 音频播放现在直接在Card组件内部处理
  
  // 多重检测方案：确保APK能被正确识别
  const isCapacitor = !!(window as any).Capacitor;
  const isNativeApp = isCapacitor && (window as any).Capacitor?.isNativePlatform?.();
  const isWebView = navigator.userAgent.includes('wv') || navigator.userAgent.includes('Version/');
  const isNotReplit = !window.location.hostname.includes('replit.dev');
  const isSmallViewport = window.innerWidth <= 480;
  
  // 如果是Capacitor原生APP，或者不是replit域名+小视口，都使用compact
  const isAPKEnvironment = isNativeApp || (isNotReplit && isSmallViewport);
  
  // APK环境使用compact，否则使用large
  const cardSize = isAPKEnvironment ? "compact" : "large";
  
  // 根据环境调整间距和堆叠效果  
  const spacing = isAPKEnvironment ? "space-x-2" : "space-x-6 md:space-x-8";
  const stackShadowSize = isAPKEnvironment ? "w-14 h-20" : "w-20 h-28";
  const emptyCardSize = isAPKEnvironment ? "w-14 h-20" : "w-20 h-28";
  
  // 调试信息
  console.log('环境检测:', {
    isCapacitor,
    isNativeApp,
    isWebView,
    isNotReplit,
    isSmallViewport,
    isAPKEnvironment,
    cardSize,
    userAgent: navigator.userAgent,
    windowSize: `${window.innerWidth}x${window.innerHeight}`,
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    capacitorPlatform: (window as any).Capacitor?.getPlatform?.()
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
