import React from "react";
import type { Element } from "@shared/schema";

interface HexagramSymbolProps {
  elements: Element[];
  className?: string;
}

// 八卦符号映射 - 使用布尔值表示阳爻(true)和阴爻(false)
const trigramSymbols = {
  sky: [true, true, true],        // 乾 ☰
  earth: [false, false, false],   // 坤 ☷
  thunder: [false, false, true],  // 震 ☳
  wind: [true, false, false],     // 巽 ☴
  water: [false, true, false],    // 坎 ☵
  fire: [true, false, true],      // 离 ☲
  mountain: [true, false, false], // 艮 ☶
  lake: [false, true, true]       // 兑 ☱
};

// 单个爻线组件
const YaoLine = ({ isYang }: { isYang: boolean }) => {
  if (isYang) {
    // 阳爻：一条完整的粗线
    return (
      <div className="w-full h-1.5 bg-white rounded-sm" />
    );
  } else {
    // 阴爻：两段分开的粗线，总长度与阳爻相等
    return (
      <div className="w-full flex justify-between">
        <div className="w-[45%] h-1.5 bg-white rounded-sm" />
        <div className="w-[45%] h-1.5 bg-white rounded-sm" />
      </div>
    );
  }
};

export default function HexagramSymbol({ elements, className = "" }: HexagramSymbolProps) {
  if (elements.length !== 2) {
    return null;
  }

  // 上卦和下卦
  const upperTrigram = trigramSymbols[elements[0]];
  const lowerTrigram = trigramSymbols[elements[1]];

  // 六爻符号，从下到上排列
  const sixLines = [...lowerTrigram, ...upperTrigram];

  return (
    <div className={`flex flex-col-reverse items-center space-y-reverse space-y-3 ${className}`}>
      {sixLines.map((isYang, index) => (
        <YaoLine 
          key={index} 
          isYang={isYang} 
        />
      ))}
    </div>
  );
}