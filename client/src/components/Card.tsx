import React, { memo } from "react";
import { Flame, Droplets, Mountain, Waves, Globe, Cloud, Zap, Wind } from "lucide-react";
import type { GameCard, Element } from "@shared/schema";
import { getCardById } from "@/data/hexagrams";
import { audioManager } from "@/lib/localAudio";

interface CardProps {
  cardId: string;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  className?: string;
  showBack?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
}

const elementIcons = {
  fire: Flame,
  water: Droplets,
  mountain: Mountain,
  lake: Waves,
  earth: Globe,
  sky: Cloud,
  thunder: Zap,
  wind: Wind,
};

const elementColors = {
  fire: "var(--card-fire)",
  water: "var(--card-water)",
  mountain: "var(--card-mountain)",
  lake: "var(--card-lake)",
  earth: "var(--card-earth)",
  sky: "var(--card-sky)",
  thunder: "var(--card-thunder)",
  wind: "var(--card-wind)",
};

const getTextColor = (elements: Element[]) => {
  const lightElements = ["sky", "thunder"];
  return elements.some(el => lightElements.includes(el)) ? "text-black" : "text-white";
};

const getIconBgColor = (element: Element, isLight: boolean) => {
  if (element === "sky") return "bg-white";
  if (element === "thunder") return isLight ? "bg-black" : "bg-white";
  if (element === "earth") return "bg-gray-500";
  return "bg-white";
};

const getElementIconColor = (element: Element) => {
  switch (element) {
    case "fire": return "text-red-600";
    case "water": return "text-blue-600";
    case "mountain": return "text-green-600";
    case "lake": return "text-amber-700";
    case "earth": return "text-white";
    case "sky": return "text-black"; 
    case "thunder": return "text-yellow-500";
    case "wind": return "text-cyan-600";
    default: return "text-gray-600";
  }
};

const getCardBackground = (elements: Element[]) => {
  if (elements.length === 1) {
    return elementColors[elements[0]];
  } else if (elements.length === 2) {
    const topColor = elementColors[elements[0]];
    const bottomColor = elementColors[elements[1]];
    return `linear-gradient(180deg, ${topColor} 0%, ${topColor} 50%, ${bottomColor} 50%, ${bottomColor} 100%)`;
  }
  return elementColors.earth;
};

function Card({
  cardId,
  size = "medium",
  onClick,
  className = "",
  showBack = false,
  isSelectable = false,
  isSelected = false,
}: CardProps) {
  const sizeClasses = {
    small: "w-12 h-16 text-xs",
    medium: "w-16 h-24 text-sm",
    large: "w-20 h-28 text-base",
  };

  const iconSizes = {
    small: "w-2 h-2",
    medium: "w-3 h-3",
    large: "w-4 h-4",
  };

  // 处理卡牌点击
  const handleCardClick = () => {
    // 使用本地音频管理器播放音频
    if (cardId && !showBack) {
      audioManager.playAudio(cardId);
    }
    
    if (onClick) {
      onClick();
    }
  };

  // 显示牌背
  if (showBack) {
    return (
      <div
        className={`
          ${sizeClasses[size]} 
          bg-gradient-to-br from-blue-900 to-purple-900 
          rounded-lg border-2 border-gray-600 
          card-glow shadow-lg card-3d 
          flex items-center justify-center
          ${onClick ? "cursor-pointer" : ""}
          ${className}
        `}
        onClick={onClick}
      >
        <div className="text-white text-center">
          <div className="text-2xl">☯</div>
        </div>
      </div>
    );
  }

  // 检查是否为有效卡牌ID
  const isValidCardId = cardId && 
    typeof cardId === 'string' && 
    cardId.length > 3 && 
    !['back', 'deck-back', 'hidden-card', 'undefined', ''].includes(cardId);

  // 无效卡牌ID - 返回空容器
  if (!isValidCardId) {
    return <div className={`${sizeClasses[size]} ${className}`} />;
  }

  // 直接获取卡牌数据 - 无网络请求
  const card = isValidCardId ? getCardById(cardId) : undefined;

  // 如果没有有效卡牌数据，返回空容器
  if (!card) {
    return <div className={`${sizeClasses[size]} ${className}`} />;
  }

  const elements = card.elements as Element[];
  const textColor = getTextColor(elements);
  const cardBackground = getCardBackground(elements);
  const isLightBg = elements.includes("sky") || elements.includes("thunder");

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        rounded-lg border-2 border-gray-300 
        card-glow shadow-lg card-3d 
        relative overflow-hidden
        ${isSelectable ? "cursor-pointer hover:selected-card" : ""}
        ${isSelected ? "selected-card" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      style={{ background: cardBackground }}
      onClick={handleCardClick}
    >
      {/* Top-left element icon */}
      {elements[0] && (
        <div className={`absolute top-1 left-1 ${iconSizes[size]} ${getIconBgColor(elements[0], isLightBg)} rounded-full flex items-center justify-center`}>
          {(() => {
            const IconComponent = elementIcons[elements[0]];
            return <IconComponent className={`${iconSizes[size]} ${getElementIconColor(elements[0])}`} />;
          })()}
        </div>
      )}

      {/* Bottom-right element icon */}
      {elements[elements.length - 1] && (
        <div className={`absolute bottom-1 right-1 ${iconSizes[size]} ${getIconBgColor(elements[elements.length - 1], !isLightBg)} rounded-full flex items-center justify-center`}>
          {(() => {
            const IconComponent = elementIcons[elements[elements.length - 1]];
            return <IconComponent className={`${iconSizes[size]} ${getElementIconColor(elements[elements.length - 1])}`} />;
          })()}
        </div>
      )}

      {/* Central hexagram name */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`
          writing-vertical font-bold font-chinese 
          ${textColor} 
          ${isLightBg ? "bg-white bg-opacity-80" : "bg-black bg-opacity-60"} 
          px-1 py-2 rounded
        `}>
          {card.name}
        </div>
      </div>
    </div>
  );
}

export default memo(Card);