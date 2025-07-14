import React, { useEffect, useRef } from 'react';

interface DirectionChangeNotificationProps {
  direction: "clockwise" | "counterclockwise";
  show: boolean;
  onHide: () => void;
}

export default function DirectionChangeNotification({ 
  direction, 
  show, 
  onHide 
}: DirectionChangeNotificationProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 自动隐藏定时器 - 使用 useRef 避免闭包问题
  useEffect(() => {
    if (show) {
      console.log(`🎬 倒转乾坤动画开始: ${direction}`);
      
      // 清除之前的计时器
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Play separated bell chimes
      setTimeout(() => {
        try {
          const audioContext = new AudioContext();
          
          // 五音阶的频率：宫商角徵羽 (C D E G A)
          const frequencies = [261.63, 293.66, 329.63, 392.00, 440.00]; // C4 D4 E4 G4 A4
          
          // 根据方向选择演奏顺序
          const playOrder = direction === 'clockwise' ? 
            [0, 1, 2, 3, 4] : // 宫商角徵羽：从低到高
            [4, 3, 2, 1, 0];  // 羽徵角商宫：从高到低
          
          // 分开弹奏每个音符
          playOrder.forEach((noteIndex, i) => {
            const delay = i * 0.25; // 每个音符间隔250ms
            
            setTimeout(() => {
              const osc = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              
              osc.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              // 钟磬音色
              osc.type = 'sine';
              osc.frequency.setValueAtTime(frequencies[noteIndex], audioContext.currentTime);
              
              // 稍长的钟磬声，更加优雅
              gainNode.gain.setValueAtTime(0, audioContext.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.10, audioContext.currentTime + 0.02);
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.18);
              
              osc.start(audioContext.currentTime);
              osc.stop(audioContext.currentTime + 0.18);
            }, delay * 1000);
          });
        } catch (error) {
          // 音频播放失败时静默处理
        }
      }, 200);
      
      // 统一的2.5秒自动隐藏计时器
      timerRef.current = setTimeout(() => {
        console.log(`🎬 倒转乾坤动画结束: ${direction}`);
        onHide();
      }, 2500);
    }
    
    // 清理函数
    return () => {
      if (timerRef.current) {
        console.log(`🎬 倒转乾坤计时器清理: ${direction}`);
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [show, direction]); // 移除 onHide 依赖，避免重复创建定时器

  if (!show) return null;

  const baguaSymbols = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷']; // 八卦符号

  return (
    <div className="fixed inset-0 z-[50] pointer-events-none">
      {/* 八卦圆圈 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div 
          className={`
            relative w-[60vw] h-[60vw] max-w-[400px] max-h-[400px]
            ${direction === "clockwise" ? "animate-spin-slow-reverse" : "animate-spin-slow"}
            opacity-100
          `}
        >
          {/* 八卦符号围成圆圈 */}
          {baguaSymbols.map((symbol, i) => (
            <div
              key={i}
              className="absolute text-white font-bold text-3xl"
              style={{
                top: `${50 + 40 * Math.sin(i * Math.PI / 4)}%`,
                left: `${50 + 40 * Math.cos(i * Math.PI / 4)}%`,
                transform: 'translate(-50%, -50%)',
                textShadow: '0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.8)',
                filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.9))'
              }}
            >
              {symbol}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}