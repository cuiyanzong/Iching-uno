import { useState, useEffect, useRef } from 'react';
import { getSkillByElement } from '@shared/skillData';
import Card from './Card';
import type { Element } from '@shared/schema';

interface SkillAnimationProps {
  isVisible: boolean;
  skillName: string;
  element: Element;
  cardIds: string[];
  onComplete: () => void;
  sourcePosition?: 'top' | 'left' | 'right' | 'bottom';
}

export default function SkillAnimation({
  isVisible,
  skillName,
  element,
  cardIds,
  onComplete,
  sourcePosition = 'bottom'
}: SkillAnimationProps) {
  // 🎯 修复：确保cardIds不为undefined，提供默认值
  const safeCardIds = cardIds || [];
  
  const [animationPhase, setAnimationPhase] = useState<'entrance' | 'stable' | 'exit'>('entrance');
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) {
      setAnimationPhase('entrance'); // 重置动画阶段
      setHasStarted(false); // 重置开始状态
      return;
    }

    // 防止重复执行动画
    if (hasStarted) {
      console.log('🎭 动画已经开始，跳过重复执行');
      return;
    }
    
    setHasStarted(true);
    console.log('🎭 技能动画开始执行 - 单次模式');
    
    // Entrance phase (0-150ms) - faster entrance
    setAnimationPhase('entrance');
    
    const stableTimer = setTimeout(() => {
      console.log('🎭 动画进入稳定阶段');
      setAnimationPhase('stable');
    }, 150);

    // Exit phase starts at 1200ms, completes at 1500ms - faster overall
    const exitTimer = setTimeout(() => {
      console.log('🎭 动画进入退出阶段');
      setAnimationPhase('exit');
    }, 1200);

    const completeTimer = setTimeout(() => {
      console.log('🎭 技能动画完成回调即将执行');
      setHasStarted(false); // 重置状态
      onComplete();
      console.log('🎭 技能动画完成回调已执行');
    }, 1500);

    return () => {
      console.log('🎭 清理动画定时器');
      clearTimeout(stableTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [isVisible]); // 移除hasStarted依赖避免循环

  // Get target position (table center)
  const getTableCenterPosition = () => {
    const tableElement = document.querySelector('.game-table-center');
    if (tableElement) {
      const rect = tableElement.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
    // Fallback to screen center
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
  };

  // Get source position based on player direction
  const getPlayerPositionByDirection = (direction: 'top' | 'left' | 'right' | 'bottom') => {
    const selectors = {
      top: '.skill-position-top',
      left: '.skill-position-left', 
      right: '.skill-position-right',
      bottom: '.skill-position-bottom'
    };
    
    const element = document.querySelector(selectors[direction]);
    if (element) {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
    
    // Fallback positions based on direction
    const fallbacks = {
      top: { x: window.innerWidth / 2, y: 80 },
      left: { x: 80, y: window.innerHeight / 2 },
      right: { x: window.innerWidth - 80, y: window.innerHeight / 2 },
      bottom: { x: window.innerWidth / 2, y: window.innerHeight - 100 }
    };
    
    return fallbacks[direction];
  };

  if (!isVisible) {
    console.log('🎭 动画组件不可见，返回null');
    return null;
  }

  const skill = getSkillByElement(element);
  if (!skill) return null;

  // Element color mappings - 基于传统八卦配色
  const elementColors: Record<Element, { 
    text: string; 
    glow: string; 
    color: string; 
    stroke: string 
  }> = {
    fire: { 
      text: 'text-red-500', 
      glow: 'shadow-red-500/50',
      color: '#ff3838',
      stroke: '#f87171'
    },
    water: { 
      text: 'text-blue-400', 
      glow: 'shadow-blue-400/50',
      color: '#90bcfc',
      stroke: '#67e8f9'
    },
    mountain: { 
      text: 'text-green-500', 
      glow: 'shadow-green-500/50',
      color: '#44e850',
      stroke: '#34d399'
    },
    lake: { 
      text: 'text-indigo-400', 
      glow: 'shadow-indigo-400/50',
      color: '#977ee7',
      stroke: '#60a5fa'
    },
    earth: { 
      text: 'text-amber-600', 
      glow: 'shadow-amber-600/50',
      color: '#cc8f5b',
      stroke: '#b45309'
    },
    sky: { 
      text: 'text-slate-100', 
      glow: 'shadow-slate-400/50',
      color: '#f1f5f9',
      stroke: '#cbd5e1'
    },
    thunder: { 
      text: 'text-yellow-400', 
      glow: 'shadow-yellow-400/50',
      color: '#facc15',
      stroke: '#fde047'
    },
    wind: { 
      text: 'text-teal-500', 
      glow: 'shadow-teal-500/50',
      color: '#14b8a6',
      stroke: '#5eead4'
    }
  };

  const colors = elementColors[element];
  const targetPos = getTableCenterPosition();
  const sourcePos = getPlayerPositionByDirection(sourcePosition);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50">
      {/* Skill Name Display - Enhanced Design, optimal position */}
      <div className={`
        fixed left-1/2 transform -translate-x-1/2
        text-center z-[60]
        transition-all duration-300 ease-out
        ${animationPhase === 'entrance' ? 'scale-0 opacity-0 rotate-12' : ''}
        ${animationPhase === 'stable' ? 'scale-110 opacity-100 rotate-0' : ''}
        ${animationPhase === 'exit' ? 'scale-125 opacity-0 rotate-6' : ''}
      `}
      style={{ top: '20%' }}>

        
        {/* Main skill name */}
        <div className="relative">
          <div 
            className={`
              text-7xl tracking-wide
              relative z-10 text-center leading-tight
            `}
            style={{
              fontFamily: '"HanYiYanKai", serif',
              color: colors.color,
              textShadow: `
                3px 3px 12px rgba(0,0,0,0.9),
                -1px -1px 6px rgba(0,0,0,0.6),
                0 0 8px rgba(255,255,255,0.3),
                0 0 16px rgba(255,255,255,0.2)
              `,
              filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.7))',

            }}
          >
            {/* 分两行显示：第一行是元素字，第二行是技能名 */}
            <div className="mb-3 text-5xl">
              {skill?.name?.split('·')?.[0] || ''}
            </div>
            <div className="text-7xl">
              {(() => {
                const skillName = skill?.name?.split('·')?.[1] || '';
                // 3个字的技能使用竖排版
                if (skillName.length === 3) {
                  return (
                    <div className="flex flex-col items-center leading-none">
                      {skillName.split('').map((char, index) => (
                        <div key={index} className="mb-1">
                          {char}
                        </div>
                      ))}
                    </div>
                  );
                }
                // 其他技能保持横排
                return skillName;
              })()}
            </div>
          </div>
          
          {/* Decorative lines */}
          <div className={`
            absolute -top-4 left-1/2 transform -translate-x-1/2
            w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent
            opacity-80
          `} />
          <div className={`
            absolute -bottom-4 left-1/2 transform -translate-x-1/2
            w-24 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent
            opacity-60
          `} />
        </div>
      </div>

      {/* Flying Cards - Fast and smooth */}
      {safeCardIds.map((cardId, index) => {
        const isStableOrExit = animationPhase === 'stable' || animationPhase === 'exit';
        const translateX = isStableOrExit ? targetPos.x - sourcePos.x : 0;
        const translateY = isStableOrExit ? targetPos.y - sourcePos.y : 0;
        
        return (
          <div
            key={`flying-card-${cardId}-${index}`}
            className="absolute z-50"
            style={{
              left: sourcePos.x - 40, // Center the card (80px width / 2)
              top: sourcePos.y - 56,  // Center the card (112px height / 2)
              transform: `translate(${translateX}px, ${translateY}px) scale(${isStableOrExit ? 0.7 : 1}) rotate(${isStableOrExit ? index * 15 : 0}deg)`,
              transition: `all 800ms cubic-bezier(0.34, 1.56, 0.64, 1)`, // Much faster with bounce effect
              transitionDelay: `${index * 50}ms`, // Reduced delay for quicker succession
              opacity: animationPhase === 'exit' ? 0 : 1,
              filter: isStableOrExit ? 'blur(1px)' : 'none' // Slight blur when flying
            }}
          >
            <Card 
              cardId={cardId} 
              size="large" 
              className={`drop-shadow-2xl ${colors.glow} border-2 border-white/30 ${isStableOrExit ? 'brightness-125' : ''}`}
            />
          </div>
        );
      })}

      {/* Enhanced Background Effect */}
      <div className={`
        fixed inset-0 
        bg-gradient-radial from-black/20 via-black/5 to-transparent
        transition-all duration-500
        ${animationPhase === 'stable' ? 'opacity-100 scale-110' : 'opacity-0 scale-100'}
      `} />
      
      {/* Particle effect overlay */}
      <div className={`
        fixed inset-0 pointer-events-none
        ${animationPhase === 'stable' ? 'opacity-30' : 'opacity-0'}
        transition-opacity duration-300
      `}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 ${colors.text.replace('text-', 'bg-')} rounded-full`}
            style={{
              left: `${20 + (i * 7)}%`,
              top: `${30 + Math.sin(i) * 20}%`,
              animation: `twinkle ${1 + (i % 3) * 0.5}s ease-in-out infinite ${i * 0.1}s`,
              opacity: 0.6
            }}
          />
        ))}
      </div>
    </div>
  );
}