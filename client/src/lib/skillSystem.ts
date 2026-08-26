import type { Element, GameState } from "@shared/schema";
import { SKILL_DEFINITIONS, getSkillByElement } from "@shared/skillData";
import { getCardElements, hasElement, findPureCard, findElementCards } from "@shared/elementMapping";
import { playSpecialEndingAudio, audioManager } from "@/lib/localAudio";

export interface SkillOpportunity {
  element: Element;
  skillName: string;
  canTrigger: boolean;
  pureCard: string | null;
  elementCards: string[];
  resonanceMatch: boolean;
  totalCards: number;
}

export interface SkillExecutionResult {
  skillUsed: string;
  cardsPlayed: string[];
  finalCard: string;
  cardsRemaining: string[];
  scoreBonus: number;
  displayBonus?: number;
  finalScore?: number;
  clearedCards: number;
  isSkillClear: boolean;
  message: string;
}

export class SkillDetector {
  /**
   * 检测基于台面卡牌元素共鸣的技能机会
   */
  static checkElementResonance(
    currentCard: string,
    playerCards: string[]
  ): SkillOpportunity[] {
    if (!currentCard || playerCards.length === 0) return [];
    
    const currentElements = getCardElements(currentCard);
    
    return SKILL_DEFINITIONS.map(skill => {
      const pureCard = findPureCard(playerCards, skill.element);
      const elementCards = findElementCards(playerCards, skill.element, true); // 排除纯色卦
      const resonanceMatch = currentElements.includes(skill.element);
      const canTrigger = !!(pureCard && elementCards.length >= skill.requiredCount && resonanceMatch);
      
      return {
        element: skill.element,
        skillName: skill.name,
        canTrigger,
        pureCard,
        elementCards,
        resonanceMatch,
        totalCards: elementCards.length + (pureCard ? 1 : 0)
      };
    }).filter(opportunity => opportunity.canTrigger);
  }

  /**
   * 检查玩家是否拥有指定元素的技能准备条件（不考虑共鸣）
   */
  static checkSkillReadiness(
    playerCards: string[],
    element: Element
  ): {
    hasSkill: boolean;
    pureCard: string | null;
    elementCards: string[];
    missingCount: number;
  } {
    const skill = getSkillByElement(element);
    if (!skill) {
      return { hasSkill: false, pureCard: null, elementCards: [], missingCount: 0 };
    }

    const pureCard = findPureCard(playerCards, element);
    const elementCards = findElementCards(playerCards, element, true);
    const hasSkill = !!(pureCard && elementCards.length >= skill.requiredCount);
    const missingCount = Math.max(0, skill.requiredCount - elementCards.length);

    return {
      hasSkill,
      pureCard,
      elementCards,
      missingCount
    };
  }
}

export class SkillExecutor {
  /**
   * 计算技能清牌奖励分数
   */
  static calculateSkillBonus(currentScore: number, clearedCards: number, battleStyle: 'quick' | 'strategic' = 'strategic'): { 
    bonusAmount: number; 
    finalScore: number; 
    displayBonus: number 
  } {
    // 显示奖励：每张牌10分
    const displayBonus = clearedCards * 10;
    
    // 根据战斗模式设置上限：快意恩仇50分，运筹帷幄150分
    const maxScore = battleStyle === 'quick' ? 50 : 150;
    
    // 实际能加到战斗分的奖励（考虑对应模式上限）
    const remainingSpace = Math.max(0, maxScore - currentScore);
    const actualBonus = Math.min(displayBonus, remainingSpace);
    
    // 最终战斗分
    const finalScore = Math.min(currentScore + actualBonus, maxScore);
    
    const result = {
      bonusAmount: actualBonus,      // 实际加到战斗分的分数
      finalScore: finalScore,        // 最终战斗分
      displayBonus: displayBonus     // 显示的奖励分数（总是每张10分）
    };
    
    return result;
  }



  /**
   * 执行元素技能
   */
  static executeElementSkill(
    element: Element,
    playerCards: string[],
    gameState: GameState,
    playerId?: number,
    currentScore: number = 0,
    battleStyle: 'quick' | 'strategic' = 'strategic'
  ): SkillExecutionResult {
    const skill = getSkillByElement(element);
    if (!skill) {
      throw new Error(`未找到元素 ${element} 对应的技能`);
    }

    const pureCard = findPureCard(playerCards, element);
    if (!pureCard) {
      throw new Error(`玩家没有 ${element} 元素的纯色卦`);
    }

    const elementCards = findElementCards(playerCards, element, true);
    if (elementCards.length < skill.requiredCount) {
      throw new Error(`${element} 元素卡牌不足，需要 ${skill.requiredCount} 张，当前 ${elementCards.length} 张`);
    }

    // 计算剩余手牌
    const cardsToRemove = [...elementCards, pureCard];
    const cardsRemaining = playerCards.filter(card => !cardsToRemove.includes(card));

    // 检查是否为技能清牌
    const isSkillClear = cardsRemaining.length === 0;
    const clearedCards = cardsToRemove.length;
    
    // 计算技能清牌奖励
    let scoreInfo = { bonusAmount: 0, finalScore: currentScore, displayBonus: 0 };
    if (isSkillClear) {
      scoreInfo = this.calculateSkillBonus(currentScore, clearedCards, battleStyle);
    }

    // 记录技能清牌事件供结算页面使用
    if (isSkillClear) {
      (window as any).lastSkillEvents = (window as any).lastSkillEvents || [];
      (window as any).lastSkillEvents.push({
        playerId: playerId || 0,
        bonusInfo: {
          skillName: skill.name,
          clearedCards,
          scoreBonus: scoreInfo.bonusAmount,
          displayBonus: scoreInfo.displayBonus,
          finalScore: scoreInfo.finalScore,
          isSkillClear
        }
      });


    }

    // 触发动画事件
    console.log('🎭 触发技能动画事件:', element, elementCards, 'playerId:', playerId);
    window.dispatchEvent(new CustomEvent('skillUsed', {
      detail: {
        element,
        cardIds: elementCards,
        skillName: skill.name,
        playerId: playerId || 0,
        bonusInfo: {
          skillName: skill.name,
          clearedCards,
          scoreBonus: scoreInfo.bonusAmount,
          displayBonus: scoreInfo.displayBonus,
          finalScore: scoreInfo.finalScore,
          isSkillClear
        }
      }
    }));

    // 播放技能音效
    try {
      import("@/lib/localAudio").then(({ audioManager }) => {
        audioManager.playSkillActivationSound();
      });
    } catch (error) {
      console.warn("技能音效播放失败:", error);
    }

    return {
      skillUsed: skill.name,
      cardsPlayed: elementCards,
      finalCard: pureCard,
      cardsRemaining,
      scoreBonus: scoreInfo.bonusAmount,
      displayBonus: scoreInfo.displayBonus,
      finalScore: scoreInfo.finalScore,
      clearedCards: clearedCards || 0,
      isSkillClear: isSkillClear || false,
      message: "" // 移除黑色提示消息
    };
  }

  /**
   * 验证技能执行的前置条件
   */
  static validateSkillExecution(
    element: Element,
    playerCards: string[],
    currentCard: string
  ): { valid: boolean; reason?: string } {
    // 检查元素共鸣
    const currentElements = getCardElements(currentCard);
    if (!currentElements.includes(element)) {
      return { valid: false, reason: `台面卡牌不包含${element}元素，无法触发共鸣` };
    }

    // 检查技能准备度
    const readiness = SkillDetector.checkSkillReadiness(playerCards, element);
    if (!readiness.hasSkill) {
      if (!readiness.pureCard) {
        return { valid: false, reason: `缺少${element}元素的纯色卦` };
      }
      if (readiness.missingCount > 0) {
        return { valid: false, reason: `${element}元素卡牌不足，还需要${readiness.missingCount}张` };
      }
    }

    return { valid: true };
  }
}

export class SkillAnalyzer {
  /**
   * 分析技能使用的战略价值（供AI使用）
   */
  static analyzeSkillValue(
    opportunity: SkillOpportunity,
    gameState: GameState,
    playerId: string
  ): {
    handReduction: number;
    strategicValue: number;
    urgency: number;
    shouldUse: boolean;
  } {
    const player = gameState.players.find(p => p.id.toString() === playerId.toString());
    if (!player) {
      return { handReduction: 0, strategicValue: 0, urgency: 0, shouldUse: false };
    }

    const handReduction = opportunity.elementCards.length;
    const currentHandSize = player.cards.length;
    
    // 计算战略价值
    let strategicValue = handReduction * 0.1; // 基础价值

    // 手牌压力因素
    if (currentHandSize > 12) strategicValue += 0.3;
    if (currentHandSize > 15) strategicValue += 0.4;

    // 游戏阶段因素
    const totalCardsInGame = gameState.players.reduce((sum, p) => sum + p.cards.length, 0);
    if (totalCardsInGame < 30) strategicValue += 0.2; // 后期游戏

    // 竞争对手威胁
    const humanPlayer = gameState.players.find(p => !p.isAI);
    if (humanPlayer && humanPlayer.cards.length < 5) {
      strategicValue += 0.4; // 人类玩家手牌少时增加价值
    }

    // 计算紧急度
    const urgency = Math.min(1.0, currentHandSize / 20);

    // 决策
    const shouldUse = strategicValue > 0.5 || urgency > 0.7;

    return {
      handReduction,
      strategicValue,
      urgency,
      shouldUse
    };
  }
}