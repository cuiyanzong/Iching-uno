import { Card as UICard } from "@/components/ui/card";
import Card from "./Card";

import type { Player } from "@shared/schema";
import { useRef, useState, useEffect, useCallback } from "react";

interface PlayerAreaProps {
  player: Player;
  position: "top" | "left" | "right" | "bottom";
  isCurrentPlayer: boolean;
  onPlayCard?: (cardId: string) => void;
  isPlayingCard?: boolean;
}

// Helper functions for card stacking
const getCardStackStyle = (index: number, totalCards: number, containerWidth: number) => {
  if (totalCards <= 1) return { left: "0px" };
  
  const maxOffset = Math.min(containerWidth - 50, (totalCards - 1) * 12);
  const offset = (index * maxOffset) / Math.max(totalCards - 1, 1);
  
  return {
    left: `${offset}px`,
    zIndex: index,
  };
};

const getVerticalCardStackStyle = (index: number, totalCards: number, containerHeight: number) => {
  if (totalCards <= 1) return { top: "0px" };
  
  const maxOffset = Math.min(containerHeight - 70, (totalCards - 1) * 12);
  const offset = (index * maxOffset) / Math.max(totalCards - 1, 1);
  
  return {
    top: `${offset}px`,
    zIndex: index,
  };
};

export default function PlayerArea({
  player,
  position,
  isCurrentPlayer,
  onPlayCard,
  isPlayingCard,
}: PlayerAreaProps) {
  // Add safety check for player object
  if (!player) {
    return null;
  }
  
  const isHuman = !player.isAI;
  

  
  // Simple scrolling for bottom player only
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [previousCardCount, setPreviousCardCount] = useState(player.cards.length);
  
  const SCROLL_AMOUNT = 120;



  // Auto-scroll to show newly drawn cards
  const scrollToEnd = useCallback(() => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollTo({ 
      left: scrollContainerRef.current.scrollWidth, 
      behavior: 'smooth' 
    });
  }, []);

  // Auto-scroll to new cards when cards are added
  useEffect(() => {
    if (position !== "bottom") return;
    
    const currentCardCount = player.cards.length;
    if (currentCardCount > previousCardCount) {
      // New card(s) were added, scroll to end to show them
      setTimeout(() => {
        scrollToEnd();
      }, 100);
    }
    setPreviousCardCount(currentCardCount);
  }, [player.cards.length, previousCardCount, position, scrollToEnd]);

  // Setup scroll and wheel support for bottom player only
  useEffect(() => {
    if (position !== "bottom") return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    // Mouse wheel support for desktop
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      container.scrollBy({ left: e.deltaY, behavior: 'smooth' });
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [player.cards.length, position]);

  // Top player layout
  if (position === "top") {
    return (
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 skill-position-top">
        <div className="text-center mb-3">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <span className={`text-sm font-semibold ${isCurrentPlayer ? "text-blue-400" : "text-gray-300"}`}>
              {player.name}
            </span>
            <span className="text-xs text-gray-400">
              {player.score}分
            </span>
            <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-bold">
              {player.cards.length}张
            </span>
          </div>
          {player.cards.length === 1 && (
            <div className="mt-1">
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                UNO!
              </span>
            </div>
          )}
        </div>
        <div className="card-stack flex justify-center" style={{ width: "300px", height: "80px" }}>
          {player.cards.map((cardId, index) => (
            <div
              key={`${cardId}-${index}`}
              className="card-stacked"
              style={{
                width: "50px",
                height: "70px",
                ...getCardStackStyle(index, player.cards.length, 300),
                top: "0px",
              }}
            >
              <Card cardId="" size="small" showBack={true} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Left player layout
  if (position === "left") {
    return (
      <div className="absolute left-1 sm:left-2 md:left-4 lg:left-6 top-1/2 transform -translate-y-1/2 skill-position-left">
        <div className="text-center mb-3">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <span className={`text-sm font-semibold ${isCurrentPlayer ? "text-blue-400" : "text-gray-300"}`}>
              {player.name}
            </span>
            <span className="text-xs text-gray-400">
              {player.score}分
            </span>
          </div>
          <div className="flex items-center justify-center">
            <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-bold">
              {player.cards.length}张
            </span>
          </div>
          {player.cards.length === 1 && (
            <div className="mt-1">
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                UNO!
              </span>
            </div>
          )}
        </div>
        <div className="card-stack relative" style={{ width: "80px", height: "250px" }}>
          {player.cards.map((cardId, index) => (
            <div
              key={`${cardId}-${index}`}
              className="card-stacked"
              style={{
                width: "50px",
                height: "70px",
                left: "15px",
                ...getVerticalCardStackStyle(index, player.cards.length, 250),
              }}
            >
              <Card cardId="" size="small" showBack={true} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Right player layout
  if (position === "right") {
    return (
      <div className="absolute right-1 sm:right-2 md:right-4 lg:right-6 top-1/2 transform -translate-y-1/2 skill-position-right">
        <div className="text-center mb-3">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <span className={`text-sm font-semibold ${isCurrentPlayer ? "text-blue-400" : "text-gray-300"}`}>
              {player.name}
            </span>
            <span className="text-xs text-gray-400">
              {player.score}分
            </span>
          </div>
          <div className="flex items-center justify-center">
            <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-bold">
              {player.cards.length}张
            </span>
          </div>
          {player.cards.length === 1 && (
            <div className="mt-1">
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                UNO!
              </span>
            </div>
          )}
        </div>
        <div className="card-stack relative" style={{ width: "80px", height: "250px" }}>
          {player.cards.map((cardId, index) => (
            <div
              key={`${cardId}-${index}`}
              className="card-stacked"
              style={{
                width: "50px",
                height: "70px",
                left: "15px",
                ...getVerticalCardStackStyle(index, player.cards.length, 250),
              }}
            >
              <Card cardId="" size="small" showBack={true} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Bottom player (human) layout with mouse wheel scrolling
  return (
    <div className="human-player-area relative">
      {/* Scrollable card container */}
      <div className="overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide"
          style={{ 
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex space-x-3 px-4">
            {player.cards.map((cardId, index) => (
              <div key={`${cardId}-${index}`} className="flex-shrink-0">
                <Card
                  cardId={cardId}
                  size="large"
                  showBack={false}
                  isSelectable={isHuman && isCurrentPlayer && onPlayCard && !isPlayingCard}
                  onClick={isHuman && isCurrentPlayer && onPlayCard && !isPlayingCard ? () => onPlayCard(cardId) : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* UNO indicator with absolute positioning to prevent layout shift */}
      {player.cards.length === 1 && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold animate-pulse">
            UNO!
          </span>
        </div>
      )}
    </div>
  );
}