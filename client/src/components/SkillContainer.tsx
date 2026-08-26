import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Element } from "@shared/schema";
import { SkillDetector, type SkillOpportunity } from "@/lib/skillSystem";
import SkillButton from "./SkillButton";

interface SkillContainerProps {
  playerCards: string[];
  currentCard: string;
  onSkillTrigger: (element: Element) => void;
  isPlayerTurn: boolean;
  disabled?: boolean;
}

export default function SkillContainer({ 
  playerCards, 
  currentCard, 
  onSkillTrigger, 
  isPlayerTurn,
  disabled = false
}: SkillContainerProps) {
  const availableSkills = useMemo(() => {
    if (!currentCard || playerCards.length === 0) return [];
    return SkillDetector.checkElementResonance(currentCard, playerCards);
  }, [currentCard, playerCards]);
  
  if (availableSkills.length === 0) return null;
  
  const getContainerLayout = (skillCount: number) => {
    if (skillCount <= 4) return "flex flex-row space-x-2";
    return "flex flex-row flex-wrap gap-2 max-w-80";
  };

  const shouldUseCompactMode = availableSkills.length > 4;
  const layoutClass = getContainerLayout(availableSkills.length);
  
  return (
    <div className="skill-container absolute left-1/2 transform -translate-x-1/2 bottom-40 z-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={`skills-${availableSkills.length}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          className={`skill-buttons-container ${layoutClass}`}
        >
          {availableSkills.map((skill, index) => (
            <motion.div
              key={skill.element}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 150
              }}
            >
              <SkillButton
                skill={skill}
                onTrigger={onSkillTrigger}
                disabled={disabled || !isPlayerTurn}
                compact={shouldUseCompactMode}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}