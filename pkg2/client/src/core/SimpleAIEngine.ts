/**
 * 简单AI引擎 - 保证不卡住
 */

import { GameState, Player } from '@shared/schema';
import { hexagramsData, GameCard } from '@shared/hexagrams';

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
        
        // 倒转乾坤逻辑由 LocalGameEngine 处理，这里不处理
        
        console.log(`✅ ${currentPlayer.name} 出牌: ${playableCard}`);
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
            
            // 倒转乾坤逻辑由 LocalGameEngine 处理，这里不处理
            
            console.log(`✅ ${currentPlayer.name} 出刚抽的牌: ${drawnCard}`);
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
      this.moveToNextPlayer(gameState);
      onGameUpdate();
      
      console.log(`✅ AI回合完成: ${currentPlayer.name}`);
      
    } catch (error) {
      console.error('AI回合错误:', error);
      onStateUpdate("");
      this.moveToNextPlayer(gameState);
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
}