import React, { useState, useEffect } from "react";
import { hexagramsData } from "@shared/hexagrams";
import type { GameCard, Element } from "@shared/schema";
import Card from "./Card";
import HexagramSymbol from "./HexagramSymbol";

export default function DailyHexagram() {
  const [dailyHexagram, setDailyHexagram] = useState<GameCard | null>(null);

  useEffect(() => {
    // 每次刷新随机选择一个有卦辞的卦象
    const hexagramsWithDivination = hexagramsData.filter(h => h.divination && h.interpretation);
    const randomIndex = Math.floor(Math.random() * hexagramsWithDivination.length);
    setDailyHexagram(hexagramsWithDivination[randomIndex]);
  }, []);

  if (!dailyHexagram) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto mb-8 text-center px-2">
      {/* 标题 */}
      <h2 className="text-2xl font-bold text-white mb-6">
        先卜一卦
      </h2>

      {/* 卦牌和六爻符号 */}
      <div className="mb-6 flex justify-center items-center gap-6">
        <Card 
          cardId={dailyHexagram.id} 
          size="large"
          onClick={() => {}}
        />
        <HexagramSymbol 
          elements={dailyHexagram.elements as Element[]}
          className="w-20 h-28 px-3 py-2"
        />
      </div>

      {/* 卦辞 */}
      <div className="mb-4 max-w-2xl mx-auto">
        <p className="text-lg font-medium text-white leading-relaxed whitespace-nowrap">
          {dailyHexagram.divination}
        </p>
      </div>

      {/* 解释 */}
      <div className="max-w-sm mx-auto">
        <p className="text-base text-gray-300 leading-relaxed">
          {dailyHexagram.interpretation}
        </p>
      </div>
    </div>
  );
}