import React, { useState, useEffect } from 'react';

interface ScoreChangeAnimationProps {
  oldScore: number;
  change: number;
  newScore: number;
  show: boolean;
  className?: string;
}

export default function ScoreChangeAnimation({
  oldScore,
  change,
  newScore,
  show,
  className = ''
}: ScoreChangeAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      // 重置动画
      setIsVisible(false);
      
      // 延迟显示积分变化
      setTimeout(() => setIsVisible(true), 200);
    }
  }, [show]);
  
  if (!show) return null;
  
  // 确定积分变化的颜色和样式
  const getChangeStyle = () => {
    if (change > 0) {
      if (change >= 300) return 'text-purple-400'; // 大杀四方
      if (change >= 200) return 'text-orange-400'; // 一箭双雕
      return 'text-green-400'; // 小胜一局
    }
    return 'text-red-400'; // 失败扣分
  };
  
  const getChangeText = () => {
    if (change > 0) {
      if (change >= 300) return '大杀四方!';
      if (change >= 200) return '一箭双雕!';
      return '小胜一局!';
    }
    return '失败扣分';
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* 简洁的积分变化显示 */}
      <div className={`transition-all duration-500 ${
        isVisible ? 'opacity-100 scale-105 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
      }`}>
        <div className={`text-lg font-bold ${getChangeStyle()}`}>
          {change > 0 ? `+${change}` : `${change}`}
        </div>
      </div>
    </div>
  );
}