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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [previousCardCount, setPreviousCardCount] = useState(player.cards.length);
  
  const SCROLL_AMOUNT = 120;

  // Update scroll indicators
  const updateScrollIndicators = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < maxScroll - 5);
  }, []);

  const scrollLeftBy = useCallback(() => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
    setTimeout(updateScrollIndicators, 150);
  }, [updateScrollIndicators]);

  const scrollRightBy = useCallback(() => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
    setTimeout(updateScrollIndicators, 150);
  }, [updateScrollIndicators]);

  // Auto-scroll to show newly drawn cards
  const scrollToEnd = useCallback(() => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollTo({ 
      left: scrollContainerRef.current.scrollWidth, 
      behavior: 'smooth' 
    });
    setTimeout(updateScrollIndicators, 300);
  }, [updateScrollIndicators]);

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

  // Setup scroll for bottom player only
  useEffect(() => {
    if (position !== "bottom") return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => updateScrollIndicators();
    container.addEventListener('scroll', handleScroll);
    
    setTimeout(() => {
      updateScrollIndicators();
    }, 100);
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [updateScrollIndicators, player.cards.length, position]);

  // Top player layout
  if (position === "top") {
    return (
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="text-center mb-3">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <span className={`text-sm font-semibold ${isCurrentPlayer ? "text-blue-400" : "text-gray-300"}`}>
              {player.name}
            </span>
            <span className="text-xs text-gray-400">
              积分({permanentScore})
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
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
        <div className="text-center mb-3">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <span className={`text-sm font-semibold ${isCurrentPlayer ? "text-blue-400" : "text-gray-300"}`}>
              {player.name}
            </span>
            <span className="text-xs text-gray-400">
              积分({permanentScore})
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
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
        <div className="text-center mb-3">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <span className={`text-sm font-semibold ${isCurrentPlayer ? "text-blue-400" : "text-gray-300"}`}>
              {player.name}
            </span>
            <span className="text-xs text-gray-400">
              积分({permanentScore})
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

  // Bottom player (human) layout with scrolling
  const needsScrollButtons = player.cards.length > 4;

  return (
    <div>
      <div className="relative flex items-center">
        {/* Left scroll button */}
        {needsScrollButtons && (
          <button
            className={`bg-black/70 hover:bg-black/90 text-white rounded-full p-2 mr-2 z-10 transition-all duration-200 ${
              canScrollLeft ? 'opacity-100' : 'opacity-50'
            }`}
            onClick={scrollLeftBy}
            disabled={!canScrollLeft}
          >
            <div className="w-3 h-3 border-l-2 border-t-2 border-white transform rotate-[-45deg]"></div>
          </button>
        )}
        
        {/* Scrollable card container */}
        <div className="flex-1 overflow-hidden">
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
        
        {/* Right scroll button */}
        {needsScrollButtons && (
          <button
            className={`bg-black/70 hover:bg-black/90 text-white rounded-full p-2 ml-2 z-10 transition-all duration-200 ${
              canScrollRight ? 'opacity-100' : 'opacity-50'
            }`}
            onClick={scrollRightBy}
            disabled={!canScrollRight}
          >
            <div className="w-3 h-3 border-r-2 border-t-2 border-white transform rotate-[45deg]"></div>
          </button>
        )}
      </div>
      
      {/* UNO indicator only */}
      {player.cards.length === 1 && (
        <div className="text-center mt-3">
          <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold animate-pulse">
            UNO!
          </span>
        </div>
      )}
    </div>
  );
}