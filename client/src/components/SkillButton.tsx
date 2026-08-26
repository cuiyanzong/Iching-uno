import { Globe, Cloud, Droplets, Flame, Zap, Wind, Mountain, Waves } from "lucide-react";
import type { Element } from "@shared/schema";
import type { SkillOpportunity } from "@/lib/skillSystem";
import { getSkillByElement } from "@shared/skillData";
import { audioManager } from "@/lib/localAudio";

interface SkillButtonProps {
  skill: SkillOpportunity;
  onTrigger: (element: Element) => void;
  disabled?: boolean;
  compact?: boolean;
}

const ELEMENT_ICONS = {
  earth: Globe,
  sky: Cloud,
  water: Droplets,
  fire: Flame,
  thunder: Zap,
  wind: Wind,
  mountain: Mountain,
  lake: Waves
};

export default function SkillButton({ 
  skill, 
  onTrigger, 
  disabled = false,
  compact = false 
}: SkillButtonProps) {
  const skillDef = getSkillByElement(skill.element);
  if (!skillDef) return null;
  
  const Icon = ELEMENT_ICONS[skill.element];
  const size = compact ? "w-10 h-10" : "w-12 h-12";
  const iconSize = compact ? "w-4 h-4" : "w-6 h-6";
  
  const handleClick = () => {
    if (!disabled && skill.canTrigger) {
      // 播放技能语音
      audioManager.playSkillAudio(skill.element);
      // 触发技能
      onTrigger(skill.element);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || !skill.canTrigger}
      className={`
        relative ${size} rounded-full
        bg-gradient-to-br from-purple-500 to-blue-600 hover:scale-110 transition-all duration-300
        border-2 border-white shadow-lg
        ${skill.resonanceMatch ? 'animate-pulse ring-2 ring-yellow-400' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        flex items-center justify-center
      `}
      title={`${skillDef.name} - ${skill.totalCards}张牌\n${skillDef.description}`}
    >
      <Icon className={`${iconSize} ${skillDef.iconClass}`} />
      
      {/* 技能就绪指示器 */}
      {skill.canTrigger && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
      )}
      
      {/* 卡牌数量指示 */}
      <div className={`
        absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full 
        text-xs text-white flex items-center justify-center font-bold
        ${compact ? 'text-[10px]' : 'text-xs'}
      `}>
        {skill.totalCards}
      </div>
      
      {/* 共鸣效果 */}
      {skill.resonanceMatch && (
        <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-pulse" />
      )}
    </button>
  );
}