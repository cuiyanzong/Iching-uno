/**
 * 简单AI引擎 - 保证不卡住
 */

import { GameState, Player } from '@shared/schema';
import { hexagramsData, type GameCard } from '@shared/hexagrams';

export class SimpleAIEngine {
  private allCards: GameCard[] = hexagramsData;

  // 主要AI处理函数
  async processAITurn(
    gameState: GameState, 
    currentPlayer: Player,
    onStateUpdate: (status: string) => void,
    onGameUpdate: () => void
  ): Promise<void> {
    try {
      console.log(`🤖 开始处理AI: ${currentPlayer.name}`);
      
      // 步骤1: 思考
      onStateUpdate(`${currentPlayer.name}正在思考...`);
      onGameUpdate();
      await this.delay(1000);

      const currentCard = this.allCards.find(c => c.id === gameState.currentCard);
      if (!currentCard) {
        console.log('找不到当前卡牌');
        return;
      }

      // 步骤1.5: 优先检查技能机会（仅在运筹帷幄模式）
      if (this.isSkillModeEnabled(gameState)) {
        const skillUsed = await this.tryUseSkill(currentPlayer, gameState, onStateUpdate, onGameUpdate);
        if (skillUsed) {
          console.log(`✅ AI回合完成: ${currentPlayer.name} (技能清牌)`);
          return; // 技能使用成功，直接结束AI回合
        }
      }

      // 步骤2: 查找可出的牌
      const playableCard = currentPlayer.cards.find(cardId => {
        const card = this.allCards.find(c => c.id === cardId);
        return card && this.canPlayCard(card, currentCard);
      });

      if (playableCard) {
        // 步骤3a: 出牌
        onStateUpdate(`${currentPlayer.name}出牌`);
        onGameUpdate();
        await this.delay(800);
        
        // 执行出牌逻辑
        const cardData = this.allCards.find(c => c.id === playableCard)!;
        currentPlayer.cards = currentPlayer.cards.filter(id => id !== playableCard);
        gameState.currentCard = playableCard;
        gameState.discardPile.push(playableCard);
        
        // AI玩家倒转乾坤检测
        const playCardData = this.allCards.find(c => c.id === playableCard);
        if (playCardData && this.isComplementaryHexagram(playCardData, currentCard)) {
          gameState.direction = gameState.direction === "clockwise" ? "counterclockwise" : "clockwise";
          
          // 触发倒转乾坤动画和音效
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('gameDirectionChanged', {
              detail: { direction: gameState.direction }
            }));
          }
        }
        
        console.log(`✅ ${currentPlayer.name} 出牌: ${playableCard}`);
        
        // 🎯 关键：检查AI普通出牌清牌
        if (currentPlayer.cards.length === 0) {
          console.log(`🎉 SimpleAI: ${currentPlayer.name} 普通出牌清牌致胜！触发结算...`);
          onStateUpdate("");
          
          // 立即触发游戏结束处理
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('gameRoundEnd', {
              detail: { playerId: currentPlayer.id }
            }));
          }
          
          return; // 直接返回，不执行后续的玩家切换逻辑
        }
      } else {
        // 步骤3b: 持续抽牌直到找到可出的牌 (UNO规则)
        onStateUpdate(`${currentPlayer.name}抽牌`);
        onGameUpdate();
        await this.delay(800);
        
        // UNO规则：必须抽到能出的牌为止
        while (true) {
          const drawnCard = this.drawCardFromDeck(gameState);
          if (!drawnCard) {
            console.log('牌堆为空，AI跳过回合');
            break;
          }
          
          currentPlayer.cards.push(drawnCard);
          console.log(`✅ ${currentPlayer.name} 抽牌: ${drawnCard}`);
          
          // 检查刚抽的牌是否可以出
          const drawnCardData = this.allCards.find(c => c.id === drawnCard);
          if (drawnCardData && this.canPlayCard(drawnCardData, currentCard)) {
            // 立即出刚抽的牌
            await this.delay(500);
            onStateUpdate(`${currentPlayer.name}出牌`);
            onGameUpdate();
            await this.delay(500);
            
            currentPlayer.cards = currentPlayer.cards.filter(id => id !== drawnCard);
            gameState.currentCard = drawnCard;
            gameState.discardPile.push(drawnCard);
            
            // AI玩家抽牌后出牌的倒转乾坤检测
            if (this.isComplementaryHexagram(drawnCardData, currentCard)) {
              gameState.direction = gameState.direction === "clockwise" ? "counterclockwise" : "clockwise";
              
              // 触发倒转乾坤动画和音效
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('gameDirectionChanged', {
                  detail: { direction: gameState.direction }
                }));
              }
            }
            
            console.log(`✅ ${currentPlayer.name} 出刚抽的牌: ${drawnCard}`);
            
            // 🎯 关键：检查AI抽牌后出牌清牌
            if (currentPlayer.cards.length === 0) {
              console.log(`🎉 SimpleAI: ${currentPlayer.name} 抽牌后出牌清牌致胜！触发结算...`);
              onStateUpdate("");
              
              // 立即触发游戏结束处理
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('gameRoundEnd', {
                  detail: { playerId: currentPlayer.id }
                }));
              }
              
              return; // 直接返回，不执行后续的玩家切换逻辑
            }
            
            break;
          } else {
            console.log(`${currentPlayer.name} 抽到 ${drawnCard} 不能出，继续抽牌`);
            // 继续抽牌
            onStateUpdate(`${currentPlayer.name}抽牌`);
            onGameUpdate();
            await this.delay(800);
          }
        }
      }

      // 步骤4: 清理状态
      onStateUpdate("");
      // 🎯 关键修复：不在SimpleAI中切换玩家，由LocalGameEngine负责
      // this.moveToNextPlayer(gameState); // 移除这行
      onGameUpdate();
      
      console.log(`✅ AI回合完成: ${currentPlayer.name}`);
      
    } catch (error) {
      console.error('AI回合错误:', error);
      onStateUpdate("");
      // 🎯 关键修复：不在SimpleAI中切换玩家，由LocalGameEngine负责
      // this.moveToNextPlayer(gameState); // 移除这行
      onGameUpdate();
    }
  }

  // 检查卡牌是否可以出
  private canPlayCard(playCard: GameCard, currentCard: GameCard): boolean {
    if (!playCard.elements || !currentCard.elements) return false;
    
    const playElements = playCard.elements;
    const currentElements = currentCard.elements;
    
    return playElements.some(element => currentElements.includes(element));
  }

  // 检查是否为互卦
  private isComplementaryHexagram(playCard: GameCard, currentCard: GameCard): boolean {
    if (!playCard.elements || !currentCard.elements) return false;
    
    const [playFirst, playSecond] = playCard.elements;
    const [currentFirst, currentSecond] = currentCard.elements;
    
    return playFirst === currentSecond && playSecond === currentFirst;
  }

  // 从牌堆抽牌
  private drawCardFromDeck(gameState: GameState): string | null {
    if (gameState.deck.length === 0) {
      this.refillDeck(gameState);
    }
    
    if (gameState.deck.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * gameState.deck.length);
    return gameState.deck.splice(randomIndex, 1)[0];
  }

  // 重新填充牌堆
  private refillDeck(gameState: GameState): void {
    const usedCards = new Set([
      ...gameState.players.flatMap(p => p.cards),
      gameState.currentCard,
      ...gameState.discardPile.slice(-10) // 保留最近10张弃牌
    ].filter(Boolean));
    
    gameState.deck = this.allCards
      .map(card => card.id)
      .filter(cardId => !usedCards.has(cardId));
    
    this.shuffleArray(gameState.deck);
    console.log(`🔄 牌堆重新填充: ${gameState.deck.length}张`);
  }

  // 移动到下一个玩家
  private moveToNextPlayer(gameState: GameState): void {
    const totalPlayers = gameState.players.length;
    if (gameState.direction === "clockwise") {
      gameState.currentPlayer = (gameState.currentPlayer + 1) % totalPlayers;
    } else {
      gameState.currentPlayer = (gameState.currentPlayer - 1 + totalPlayers) % totalPlayers;
    }
  }

  // 工具函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // 检查是否启用技能模式
  private isSkillModeEnabled(gameState: GameState): boolean {
    // 所有战斗模式都支持技能系统
    return true;
  }

  // AI技能尝试
  private async tryUseSkill(
    player: Player, 
    gameState: GameState, 
    onStateUpdate: (status: string) => void,
    onGameUpdate: () => void
  ): Promise<boolean> {
    try {
      const { SkillDetector } = await import("@/lib/skillSystem");
      
      // 检测可用技能
      const opportunities = SkillDetector.checkElementResonance(
        gameState.currentCard || '',
        player.cards
      );

      if (opportunities.length === 0) {
        return false;
      }

      // 选择第一个可用技能
      const opportunity = opportunities[0];
      console.log(`🎯 SimpleAI: ${player.name} 准备使用技能: ${opportunity.element}`);
      
      // 显示技能使用状态
      onStateUpdate(`${player.name}使用技能`);
      onGameUpdate();
      await this.delay(800);

      // 执行技能
      const { SkillExecutor } = await import("@/lib/skillSystem");
      
      // 从游戏状态中获取战斗模式
      const battleStyle = (gameState as any).battleStyle || 'strategic';
      
      const result = SkillExecutor.executeElementSkill(
        opportunity.element,
        player.cards,
        gameState,
        player.id,
        player.score,
        battleStyle
      );

      // 更新玩家手牌和台面卡牌
      player.cards = result.cardsRemaining;
      gameState.currentCard = result.finalCard;
      gameState.discardPile.push(result.finalCard);

      // AI技能清牌奖励
      console.log(`🔍 SimpleAI检查技能清牌奖励: isSkillClear=${result.isSkillClear}, scoreBonus=${result.scoreBonus}, displayBonus=${result.displayBonus}, 玩家当前分数=${player.score}`);
      if (result.isSkillClear) {
        const oldScore = player.score;
        
        // 实际分数增加（可能为0如果已达上限）
        if (result.scoreBonus > 0) {
          player.score += result.scoreBonus;
          if (player.userId) {
            gameState.scores[player.userId] = player.score;
          }
        }
        
        console.log(`🎯 SimpleAI技能清牌处理: ${player.name} 分数从 ${oldScore} 变为 ${player.score} (实际+${result.scoreBonus}分), 显示奖励 ${result.displayBonus} 分`);
        

      }

      console.log(`✨ SimpleAI技能使用成功: ${player.name} 使用了 ${result.skillUsed}`);

      // 注意：skillUsed事件已经在SkillExecutor.executeElementSkill中触发，这里不需要重复发送

      // 🎯 关键修复：检查技能清牌时等待动画完成
      console.log(`🔍 SimpleAI检查清牌状态: ${player.name} 剩余卡牌=${player.cards.length}, isSkillClear=${result.isSkillClear}`);
      
      if (result.isSkillClear && player.cards.length === 0) {
        console.log(`🎉 SimpleAI: ${player.name} 技能清牌致胜！等待动画完成...`);
        
        // 记录技能清牌信息
        (window as any).skillClearInfo = {
          playerId: player.id,
          skillName: result.skillUsed,
          clearedCards: result.clearedCards || 0,
          bonusScore: result.scoreBonus || 0,
          displayBonus: result.displayBonus || (result.clearedCards || 0) * 10,
          finalScore: result.finalScore || player.score
        };
        
        // 等待技能动画完成（1.5秒）后再进入结算页面
        await this.delay(1500);
        
        console.log(`🎭 SimpleAI技能动画完成，触发结算页面`);
        
        // 触发游戏结束处理
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('gameRoundEnd', {
            detail: { playerId: player.id }
          }));
        }
        
        return true; // 直接返回，不执行后续的玩家切换逻辑
      }

      // 清理状态
      onStateUpdate("");
      // 🎯 关键修复：不在SimpleAI中切换玩家，由LocalGameEngine负责统一玩家管理
      onGameUpdate();

      return true;
      
    } catch (error) {
      console.error(`SimpleAI技能使用失败:`, error);
      return false;
    }
  }

  // 获取玩家位置用于动画
  private getPlayerPosition(playerId: number): string {
    const positions = ['human', 'top', 'left', 'right'];
    return positions[playerId] || 'top';
  }
}