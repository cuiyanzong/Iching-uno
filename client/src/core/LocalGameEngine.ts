/**
 * 本地游戏引擎 - 单机版核心
 * 替代服务器端逻辑，管理完整游戏状态
 */

import type { GameState, Player, GameCard, BattleStyle } from "@shared/schema";
import { hexagramsData } from "@/../../shared/hexagrams";
import { getPlayerScoreByName } from "@/utils/permanentScores";


export interface AIAction {
  type: 'play' | 'draw' | 'skill';
  cardId?: string;
  element?: string;
}

export interface GameResult {
  success: boolean;
  gameState: GameState;
  message?: string;
}

export class LocalGameEngine {
  private gameState: GameState | null = null;
  private eventTarget: EventTarget = new EventTarget();
  private allCards: GameCard[] = hexagramsData;
  private isProcessingAI: boolean = false;
  private currentBattleStyle: BattleStyle | null = null; // 保存当前战斗风格
  private simpleAI: any; // 引用SimpleAIEngine实例
  
  // 注意：现在使用真正的SimpleAIEngine，不再需要内嵌的fallbackAI
  private fallbackAI = new (class {
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

        const allCards = hexagramsData;
        const currentCard = allCards.find(c => c.id === gameState.currentCard);
        if (!currentCard) return;

        // 步骤2: 优先尝试使用技能（仅在运筹帷幄模式）
        // 注意：技能逻辑已经集成到SimpleAIEngine中，这里不再重复处理

        // 步骤3: 查找可出的牌
        const playableCard = currentPlayer.cards.find(cardId => {
          const card = allCards.find(c => c.id === cardId);
          return card && this.canPlayCard(card, currentCard);
        });

        if (playableCard) {
          // 步骤3a: 出牌
          onStateUpdate(`${currentPlayer.name}出牌`);
          onGameUpdate();
          await this.delay(800);
          
          const cardData = allCards.find(c => c.id === playableCard)!;
          currentPlayer.cards = currentPlayer.cards.filter(id => id !== playableCard);
          gameState.currentCard = playableCard;
          gameState.discardPile.push(playableCard);
          
          if (this.isComplementaryHexagram(cardData, currentCard)) {
            gameState.direction = gameState.direction === "clockwise" ? "counterclockwise" : "clockwise";
            
            // 触发统一的倒转乾坤动画
            console.log(`🔄 AI玩家 ${currentPlayer.name} 触发倒转乾坤，方向变为: ${gameState.direction}`);
            window.dispatchEvent(new CustomEvent('gameDirectionChanged', {
              detail: { direction: gameState.direction }
            }));
          }
          
          console.log(`✅ ${currentPlayer.name} 出牌: ${playableCard}`);
        } else {
          // 步骤3b: UNO规则 - 持续抽牌直到能出牌为止
          onStateUpdate(`${currentPlayer.name}抽牌`);
          onGameUpdate();
          await this.delay(800);
          
          // UNO规则：必须抽到能出的牌为止
          while (true) {
            const drawnCard = this.drawCardFromDeck(gameState);
            if (!drawnCard) {
              console.log(`${currentPlayer.name} 牌堆空了，结束回合`);
              break;
            }
            
            currentPlayer.cards.push(drawnCard);
            console.log(`✅ ${currentPlayer.name} 抽牌: ${drawnCard}`);
            
            const drawnCardData = allCards.find(c => c.id === drawnCard);
            if (drawnCardData && this.canPlayCard(drawnCardData, currentCard)) {
              // 立即出刚抽的牌
              await this.delay(500);
              onStateUpdate(`${currentPlayer.name}出牌`);
              onGameUpdate();
              await this.delay(500);
              
              currentPlayer.cards = currentPlayer.cards.filter(id => id !== drawnCard);
              gameState.currentCard = drawnCard;
              gameState.discardPile.push(drawnCard);
              
              if (this.isComplementaryHexagram(drawnCardData, currentCard)) {
                gameState.direction = gameState.direction === "clockwise" ? "counterclockwise" : "clockwise";
                
                // 触发统一的倒转乾坤动画
                console.log(`🔄 AI玩家 ${currentPlayer.name} 抽牌触发倒转乾坤，方向变为: ${gameState.direction}`);
                window.dispatchEvent(new CustomEvent('gameDirectionChanged', {
                  detail: { direction: gameState.direction }
                }));
              }
              
              console.log(`✅ ${currentPlayer.name} 出刚抽的牌: ${drawnCard}`);
              break; // 找到可出的牌，结束循环
            } else {
              console.log(`${currentPlayer.name} 抽到 ${drawnCard} 不能出，继续抽牌`);
              // 继续抽牌
              onStateUpdate(`${currentPlayer.name}抽牌`);
              onGameUpdate();
              await this.delay(800);
            }
          }
        }

        onStateUpdate("");
        console.log(`✅ AI回合完成: ${currentPlayer.name}`);
        
      } catch (error) {
        console.error('AI回合错误:', error);
        onStateUpdate("");
      }
    }

    private canPlayCard(playCard: any, currentCard: any): boolean {
      if (!playCard.elements || !currentCard.elements) return false;
      return playCard.elements.some((element: any) => currentCard.elements.includes(element));
    }

    private isComplementaryHexagram(playCard: any, currentCard: any): boolean {
      if (!playCard.elements || !currentCard.elements) return false;
      const [playFirst, playSecond] = playCard.elements;
      const [currentFirst, currentSecond] = currentCard.elements;
      return playFirst === currentSecond && playSecond === currentFirst;
    }

    private drawCardFromDeck(gameState: GameState): string | null {
      if (gameState.deck.length === 0) {
        const usedCards = new Set([
          ...gameState.players.flatMap(p => p.cards),
          gameState.currentCard,
          ...gameState.discardPile.slice(-10)
        ].filter(Boolean));
        
        gameState.deck = hexagramsData
          .map(card => card.id)
          .filter(cardId => !usedCards.has(cardId));
        
        for (let i = gameState.deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
        }
      }
      
      if (gameState.deck.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * gameState.deck.length);
      return gameState.deck.splice(randomIndex, 1)[0];
    }

    private delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }


  })();

  constructor() {
    // 初始化SimpleAIEngine
    import('./SimpleAIEngine').then(({ SimpleAIEngine }) => {
      this.simpleAI = new SimpleAIEngine();
    });
    this.setupEventHandlers();
  }

  // 发牌函数
  private dealCards(): void {
    if (!this.gameState) return;
    
    // 确保每个玩家有5张牌
    this.gameState.players.forEach(player => {
      while (player.cards.length < 5 && this.gameState!.deck.length > 0) {
        const card = this.gameState!.deck.pop()!;
        player.cards.push(card);
      }
    });
  }

  // 创建新游戏
  createGame(playerName: string, battleStyle?: BattleStyle | null): GameState {
    const gameId = Date.now();
    const userId = Date.now() + Math.floor(Math.random() * 1000);

    // 🧹 清理上一局的技能清牌事件信息
    (window as any).skillClearInfo = null;
    (window as any).lastSkillEvents = [];
    console.log('🧹 已清理上一局技能清牌事件信息');

    // 保存战斗风格
    this.currentBattleStyle = battleStyle || "strategic";
    
    // 根据战斗风格确定初始分数
    const initialScore = this.currentBattleStyle === "quick" ? 50 : 150;

    // 创建玩家
    const players: Player[] = [
      {
        id: 0,
        userId,
        name: playerName,
        cards: [],
        score: initialScore, // 回合战斗分，根据战斗风格而定
        isAI: false,
        socketId: "local_player",
        isReady: true,
        originalName: playerName
      },
      {
        id: 1,
        userId: 1001,
        name: "阿豪",
        cards: [],
        score: initialScore,
        isAI: true,
        socketId: null,
        isReady: true,
        originalName: "阿豪"
      },
      {
        id: 2,
        userId: 1002,
        name: "老宋",
        cards: [],
        score: initialScore,
        isAI: true,
        socketId: null,
        isReady: true,
        originalName: "老宋"
      },
      {
        id: 3,
        userId: 1003,
        name: "阿宗",
        cards: [],
        score: initialScore,
        isAI: true,
        socketId: null,
        isReady: true,
        originalName: "阿宗"
      }
    ];

    // 初始化牌堆
    const allCardIds = this.allCards.map(card => card.id);
    const deck = this.shuffleArray([...allCardIds]);

    // 发牌：每人5张
    players.forEach(player => {
      player.cards = deck.splice(0, 5);
    });

    // 台面卡片
    const currentCard = deck.pop() || allCardIds[0];

    this.gameState = {
      id: gameId,
      hostId: userId,
      mode: "single",
      status: "playing",
      battleStyle: battleStyle || "strategic",
      players,
      currentPlayer: 0,
      deck,
      currentCard,
      direction: "clockwise",
      discardPile: [currentCard],
      scores: { [userId]: initialScore, 1001: initialScore, 1002: initialScore, 1003: initialScore },
      round: 1,
      maxPlayers: 4,
      notifications: [],
      playerActivity: {},
      aiActionStatus: "",
      roomCode: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.emitGameUpdate();
    
    console.log(`🎮 游戏初始化完成，当前玩家: ${players[0].name}，AI玩家: ${players.slice(1).map(p => p.name).join(', ')}`);
    console.log(`🎲 台面卡片: ${currentCard}`);
    
    // 启动AI回合处理
    setTimeout(() => {
      console.log(`⏰ 准备启动AI回合检查...`);
      this.processAITurns();
    }, 1000);
    
    return this.gameState;
  }

  // 玩家出牌
  async playCard(cardId: string): Promise<GameResult> {
    if (!this.gameState || this.isProcessingAI) {
      return { success: false, gameState: this.gameState! };
    }

    const currentPlayer = this.gameState.players[this.gameState.currentPlayer];
    if (currentPlayer.isAI || !currentPlayer.cards.includes(cardId)) {
      return { success: false, gameState: this.gameState };
    }

    const playCard = this.allCards.find(card => card.id === cardId);
    const currentCard = this.allCards.find(card => card.id === this.gameState!.currentCard);

    if (!playCard || !currentCard) {
      return { success: false, gameState: this.gameState };
    }

    // 检查卡牌匹配
    if (!this.canPlayCard(playCard, currentCard)) {
      return { success: false, gameState: this.gameState, message: "这张不行" };
    }

    // 执行出牌
    const directionChanged = this.isComplementaryHexagram(playCard, currentCard);
    let changedToDirection: "clockwise" | "counterclockwise" | undefined;

    // 更新游戏状态
    currentPlayer.cards = currentPlayer.cards.filter(id => id !== cardId);
    this.gameState.currentCard = cardId;
    this.gameState.discardPile.push(cardId);

    // 检查方向变化
    if (directionChanged) {
      this.gameState.direction = this.gameState.direction === "clockwise" ? "counterclockwise" : "clockwise";
      
      // 触发统一的倒转乾坤动画
      window.dispatchEvent(new CustomEvent('gameDirectionChanged', {
        detail: { direction: this.gameState.direction }
      }));
    }

    // 检查游戏结束
    if (currentPlayer.cards.length === 0) {
      console.log(`🏆 玩家 ${currentPlayer.name} 清牌获胜！`);
      return this.handleRoundEnd(this.gameState.currentPlayer);
    }

    // 下一个玩家
    this.moveToNextPlayer();
    this.emitGameUpdate();

    // 处理AI回合
    setTimeout(() => this.processAITurns(), 500);

    return {
      success: true,
      gameState: this.gameState
    };
  }

  // 玩家抽牌
  async drawCard(): Promise<GameResult> {
    if (!this.gameState || this.isProcessingAI) {
      return { success: false, gameState: this.gameState! };
    }

    const currentPlayer = this.gameState.players[this.gameState.currentPlayer];
    if (currentPlayer.isAI) {
      return { success: false, gameState: this.gameState };
    }

    const drawnCard = this.drawCardFromDeck();
    if (!drawnCard) {
      return { success: false, gameState: this.gameState, message: "牌堆已空" };
    }

    currentPlayer.cards.push(drawnCard);
    this.emitGameUpdate();

    // UNO规则：抽牌后不切换玩家，仍然是当前玩家的回合
    return { success: true, gameState: this.gameState };
  }

  // AI助手
  async triggerAIAssist(): Promise<GameResult> {
    if (!this.gameState) {
      return { success: false, gameState: this.gameState! };
    }

    const currentPlayer = this.gameState.players[this.gameState.currentPlayer];
    
    // 🚫 绝对拒绝：AI助手不能给AI玩家操作
    if (currentPlayer.isAI === true) {
      console.log(`❌ AI助手严格拒绝 - 当前玩家是AI: ${currentPlayer.name} (isAI: ${currentPlayer.isAI})`);
      return { success: false, gameState: this.gameState, message: "AI助手不能帮助AI玩家" };
    }

    // 🚫 双重检查：确保当前玩家是人类
    if (currentPlayer.isAI !== false) {
      console.log(`❌ AI助手严格拒绝 - 玩家状态不明确: ${currentPlayer.name} (isAI: ${currentPlayer.isAI})`);
      return { success: false, gameState: this.gameState, message: "AI助手只能帮助人类玩家" };
    }

    console.log(`🤖 AI助手启动，帮助人类玩家: ${currentPlayer.name} (isAI: ${currentPlayer.isAI})`);

    // AI助手清理状态，不显示文字提示
    this.gameState.aiActionStatus = "";
    this.emitGameUpdate();

    // 延迟1.2秒后执行AI助手操作
    setTimeout(async () => {
      await this.executeAIAssist(currentPlayer);
      
      // AI助手操作完成后，立即启动AI处理
      setTimeout(() => {
        this.processAITurns();
      }, 1000);
    }, 1200);

    return { success: true, gameState: this.gameState };
  }

  // 执行AI助手逻辑 - 专为人类玩家服务
  private async executeAIAssist(player: Player): Promise<void> {
    if (!this.gameState) return;

    // 🚫 AI助手绝对拒绝给AI玩家操作
    if (player.isAI === true) {
      console.log(`❌ AI助手拒绝操作AI玩家: ${player.name}`);
      return;
    }

    console.log(`🤖 执行操作`);

    const currentCard = this.allCards.find(card => card.id === this.gameState!.currentCard);
    if (!currentCard) return;

    // 🎯 优先级0: AI助手检测技能机会（仅在运筹帷幄模式）
    if (this.isSkillModeEnabled()) {
      try {
        const { SkillDetector, SkillAnalyzer } = await import("@/lib/skillSystem");
        
        const opportunities = SkillDetector.checkElementResonance(
          this.gameState.currentCard,
          player.cards
        );

        for (const opportunity of opportunities) {
          const analysis = SkillAnalyzer.analyzeSkillValue(
            opportunity,
            this.gameState,
            player.id.toString()
          );

          if (analysis.shouldUse) {
            console.log(`🤖 AI助手帮助 ${player.name} 使用技能: ${opportunity.skillName}`);
            const skillResult = await this.useSkill(opportunity.element);
            if (skillResult.success) {
              // 技能事件已在skillSystem.ts中自动触发
              
              // 检查游戏结束 - AI助手技能清牌时等待动画完成
              if (player.cards.length === 0) {
                console.log(`🎉 AI助手帮助 ${player.name} 技能清牌致胜！等待动画完成...`);
                this.gameState.aiActionStatus = "";
                // 等待技能动画完成（1.5秒）后再进入结算页面
                setTimeout(() => {
                  console.log(`🎭 技能动画完成，进入结算页面`);
                  this.handleRoundEnd(player.id);
                }, 1500);
                return;
              }
              
              this.moveToNextPlayer();
              this.gameState.aiActionStatus = "";
              this.emitGameUpdate();
              return;
            }
          }
        }
      } catch (error) {
        console.error(`AI助手技能检测错误:`, error);
      }
    }

    // 🎯 保持原有逻辑：技能不可用时寻找可出的牌
    const playableCard = player.cards.find(cardId => {
      const card = this.allCards.find(c => c.id === cardId);
      return card && this.canPlayCard(card, currentCard);
    });

    if (playableCard) {
      // AI助手出牌
      const playCard = this.allCards.find(card => card.id === playableCard)!;
      const directionChanged = this.isComplementaryHexagram(playCard, currentCard);

      player.cards = player.cards.filter(id => id !== playableCard);
      this.gameState.currentCard = playableCard;
      this.gameState.discardPile.push(playableCard);

      if (directionChanged) {
        this.gameState.direction = this.gameState.direction === "clockwise" ? "counterclockwise" : "clockwise";
        
        // 触发统一的倒转乾坤动画
        console.log(`🔄 AI助手帮助 ${player.name} 触发倒转乾坤，方向变为: ${this.gameState.direction}`);
        window.dispatchEvent(new CustomEvent('gameDirectionChanged', {
          detail: { direction: this.gameState.direction }
        }));
      }

      // 检查游戏结束
      if (player.cards.length === 0) {
        this.gameState.aiActionStatus = "";
        this.handleRoundEnd(player.id);
        return;
      }

      this.moveToNextPlayer();
    } else {
      // AI助手持续抽牌直到能出牌 (UNO规则)
      await this.executeAIAssistDrawUntilPlayable(player, currentCard);
      this.moveToNextPlayer();
    }

    this.gameState.aiActionStatus = "";
    this.emitGameUpdate();
  }

  // AI助手抽牌逻辑 - 持续抽牌直到能出牌
  private async executeAIAssistDrawUntilPlayable(player: Player, currentCard: GameCard): Promise<void> {
    if (!this.gameState) return;

    console.log(`🎯 执行持续抽牌`);
    
    // UNO规则：持续抽牌直到找到可出的牌
    while (true) {
      this.gameState.aiActionStatus = `${player.name}抽牌`;
      this.emitGameUpdate();
      await this.delay(800);

      const drawnCard = this.drawCardFromDeck(this.gameState);
      if (!drawnCard) {
        console.log('牌堆为空，AI助手停止抽牌');
        break;
      }

      player.cards.push(drawnCard);
      console.log(`✅ 抽牌: ${drawnCard}`);

      // 检查刚抽的牌是否可以出
      const drawnCardData = this.allCards.find(c => c.id === drawnCard);
      if (drawnCardData && this.canPlayCard(drawnCardData, currentCard)) {
        // 立即出刚抽的牌
        this.gameState.aiActionStatus = `${player.name}出牌`;
        this.emitGameUpdate();
        await this.delay(500);

        player.cards = player.cards.filter(id => id !== drawnCard);
        this.gameState.currentCard = drawnCard;
        this.gameState.discardPile.push(drawnCard);

        // 检查扭转乾坤
        if (this.isComplementaryHexagram(drawnCardData, currentCard)) {
          this.gameState.direction = this.gameState.direction === "clockwise" ? "counterclockwise" : "clockwise";
          
          // 触发统一的倒转乾坤动画
          console.log(`🔄 AI助手帮助 ${player.name} 抽牌触发倒转乾坤，方向变为: ${this.gameState.direction}`);
          window.dispatchEvent(new CustomEvent('gameDirectionChanged', {
            detail: { direction: this.gameState.direction }
          }));
        }

        // 检查游戏结束
        if (player.cards.length === 0) {
          this.handleRoundEnd(player.id);
          return;
        }

        this.moveToNextPlayer();
        console.log(`✅ 出刚抽的牌: ${drawnCard}`);
        break;
      } else {
        console.log(`抽到 ${drawnCard} 不能出，继续抽牌`);
      }
    }
  }

  // 简化的AI回合处理器 - 使用SimpleAIEngine
  private async processAITurns(): Promise<void> {
    if (!this.gameState || this.isProcessingAI) return;

    const currentPlayer = this.gameState.players[this.gameState.currentPlayer];
    if (!currentPlayer.isAI) return;

    console.log(`🤖 简单AI处理: ${currentPlayer.name}`);
    this.isProcessingAI = true;
    
    try {
      // 确保SimpleAIEngine已加载
      if (!this.simpleAI) {
        const { SimpleAIEngine } = await import('./SimpleAIEngine');
        this.simpleAI = new SimpleAIEngine();
      }
      
      // 使用包含完整清牌等待逻辑的SimpleAIEngine
      await this.simpleAI.processAITurn(
        this.gameState,
        currentPlayer,
        (status: string) => {
          if (this.gameState) {
            this.gameState.aiActionStatus = status;
            this.emitGameUpdate(); // 立即更新状态
          }
        },
        () => this.emitGameUpdate()
      );
      
      console.log(`🏁 AI ${currentPlayer.name} 回合结束，手牌数量: ${currentPlayer.cards.length}`);
      
      this.isProcessingAI = false;
      this.gameState.aiActionStatus = "";
      
      // 注意：游戏结束检查现在在SimpleAIEngine中处理，包含技能清牌等待逻辑
      if (currentPlayer.cards.length === 0) {
        console.log(`🎉 ${currentPlayer.name} 获胜！游戏结束 - 已在SimpleAI中处理`);
        return; // SimpleAIEngine已经处理了清牌等待和结算
      }
      
      // 移动到下一个玩家
      this.moveToNextPlayer();
      this.emitGameUpdate();
      
      console.log(`🔄 准备处理下一个玩家回合`);
      // 立即继续下一个AI回合
      setTimeout(() => {
        console.log(`⏰ 准备启动AI回合检查...`);
        this.processAITurns();
      }, 800);
      
    } catch (error) {
      console.error('🚨 AI处理错误:', error);
      this.isProcessingAI = false;
      if (this.gameState) {
        this.gameState.aiActionStatus = "";
        this.moveToNextPlayer();
        this.emitGameUpdate();
        
        // 错误恢复：继续下一个AI回合
        setTimeout(() => {
          console.log(`⏰ 错误恢复：准备启动AI回合检查...`);
          this.processAITurns();
        }, 800);
      }
    }
  }

  // 处理单个AI回合
  private async processAITurn(currentPlayer: Player): Promise<void> {
    if (!this.gameState) {
      console.log(`❌ AI回合失败: 游戏状态为空`);
      this.isProcessingAI = false;
      return;
    }

    console.log(`🎯 AI ${currentPlayer.name} 开始思考...手牌数量: ${currentPlayer.cards.length}`);
    console.log(`🎯 当前台面卡: ${this.gameState.currentCard}`);
    
    // AI思考延迟
    this.gameState.aiActionStatus = `${currentPlayer.name}正在思考...`;
    this.emitGameUpdate();
    await this.delay(1200);
    
    // 确保游戏状态仍然有效
    if (!this.gameState) {
      console.log(`❌ AI思考期间游戏状态丢失`);
      this.isProcessingAI = false;
      return;
    }

    const currentCard = this.allCards.find(card => card.id === this.gameState.currentCard);
    if (!currentCard) {
      console.log(`❌ AI回合失败: 找不到当前台面卡牌 ${this.gameState.currentCard}`);
      this.isProcessingAI = false;
      return;
    }

    console.log(`🎯 当前台面卡牌: ${currentCard.id}, AI正在决策...`);

    // AI决策
    const action = await this.makeAIDecision(currentPlayer, currentCard);
    if (action.type === 'skill' && action.element) {
      console.log(`🎯 AI决策结果: 技能使用 - ${action.element}元素`);
      console.log(`✨ AI ${currentPlayer.name} 准备使用技能: ${action.element}元素`);
      await this.executeAISkill(currentPlayer, action.element);
    } else if (action.type === 'play' && action.cardId) {
      console.log(`🎯 AI决策结果: 出牌 - ${action.cardId}`);
      console.log(`▶️ AI ${currentPlayer.name} 准备出牌: ${action.cardId}`);
      await this.executeAIPlay(currentPlayer, action.cardId, currentCard);
    } else {
      console.log(`🎯 AI决策结果: 抽牌`);
      console.log(`🃏 AI ${currentPlayer.name} 准备抽牌`);
      await this.executeAIDraw(currentPlayer, currentCard);
    }

    this.isProcessingAI = false;
  }

  // AI技能执行
  private async executeAISkill(player: Player, element: string): Promise<void> {
    if (!this.gameState) return;

    console.log(`✨ 执行AI技能: ${player.name} -> ${element}元素技能`);
    
    // 显示技能使用状态
    this.gameState.aiActionStatus = `${player.name}使用技能`;
    this.emitGameUpdate();
    await this.delay(800);

    try {
      const skillResult = await this.useSkill(element);
      if (skillResult.success) {
        console.log(`✅ ${player.name} 技能使用成功: ${skillResult.message}`);
        
        // 技能事件已在skillSystem.ts中自动触发
        
        // 检查胜利条件 - 技能清牌时等待动画完成
        if (player.cards.length === 0) {
          console.log(`🎉 ${player.name} 技能清牌致胜！等待动画完成...`);
          // 等待技能动画完成（1.5秒）后再进入结算页面
          setTimeout(() => {
            console.log(`🎭 技能动画完成，进入结算页面`);
            this.handleRoundEnd(player.id);
          }, 1500);
          return;
        }
      } else {
        console.log(`❌ ${player.name} 技能使用失败: ${skillResult.message}`);
        // 技能失败时退回到普通出牌逻辑
        const currentCard = this.allCards.find(card => card.id === this.gameState!.currentCard);
        if (currentCard) {
          const fallbackAction = await this.makeAIDecisionFallback(player, currentCard);
          if (fallbackAction.type === 'play' && fallbackAction.cardId) {
            console.log(`🔄 ${player.name} 技能失败，退回普通出牌: ${fallbackAction.cardId}`);
            await this.executeAIPlay(player, fallbackAction.cardId, currentCard);
            return;
          } else {
            console.log(`🔄 ${player.name} 技能失败且无法出牌，改为抽牌`);
            await this.executeAIDraw(player, currentCard);
            return;
          }
        }
      }
    } catch (error) {
      console.error(`AI技能执行错误:`, error);
      // 技能执行异常时也退回到普通逻辑
      this.gameState.aiActionStatus = `${player.name}出牌`;
      const currentCard = this.allCards.find(card => card.id === this.gameState!.currentCard);
      if (currentCard) {
        const fallbackAction = await this.makeAIDecisionFallback(player, currentCard);
        if (fallbackAction.type === 'play' && fallbackAction.cardId) {
          await this.executeAIPlay(player, fallbackAction.cardId, currentCard);
          return;
        } else {
          await this.executeAIDraw(player, currentCard);  
          return;
        }
      }
    }

    this.gameState.aiActionStatus = "";
  }

  // AI决策后备方案（技能失败时使用）
  private async makeAIDecisionFallback(player: Player, currentCard: GameCard): Promise<AIAction> {
    // 互卦优先
    for (const cardId of player.cards) {
      const card = this.allCards.find(c => c.id === cardId);
      if (card && this.isComplementaryHexagram(card, currentCard)) {
        return { type: 'play', cardId };
      }
    }

    // 普通匹配
    const playableCard = player.cards.find(cardId => {
      const card = this.allCards.find(c => c.id === cardId);
      return card && this.canPlayCard(card, currentCard);
    });

    return playableCard ? { type: 'play', cardId: playableCard } : { type: 'draw' };
  }

  // AI决策
  private async makeAIDecision(player: Player, currentCard: GameCard): Promise<AIAction> {
    // 🎯 优先级0: 检测技能机会（仅在运筹帷幄模式）
    if (this.isSkillModeEnabled()) {
      try {
        const { SkillDetector, SkillAnalyzer } = await import("@/lib/skillSystem");
        
        const opportunities = SkillDetector.checkElementResonance(
          this.gameState!.currentCard,
          player.cards
        );

        for (const opportunity of opportunities) {
          const analysis = SkillAnalyzer.analyzeSkillValue(
            opportunity,
            this.gameState!,
            player.id.toString()
          );

          if (analysis.shouldUse) {
            console.log(`🤖 ${player.name} 决定使用技能: ${opportunity.skillName}`);
            return { type: 'skill', element: opportunity.element };
          }
        }
      } catch (error) {
        console.error(`AI技能检测错误:`, error);
      }
    }

    // 🎯 保持原有逻辑：技能不可用时的决策
    // 寻找最佳卡牌（优先互卦）
    let bestCard: string | null = null;
    
    // 优先级1: 互卦
    for (const cardId of player.cards) {
      const card = this.allCards.find(c => c.id === cardId);
      if (card && this.isComplementaryHexagram(card, currentCard)) {
        bestCard = cardId;
        break;
      }
    }

    // 优先级2: 普通匹配
    if (!bestCard) {
      bestCard = player.cards.find(cardId => {
        const card = this.allCards.find(c => c.id === cardId);
        return card && this.canPlayCard(card, currentCard);
      }) || null;
    }

    return bestCard ? { type: 'play', cardId: bestCard } : { type: 'draw' };
  }

  // AI出牌
  private async executeAIPlay(player: Player, cardId: string, currentCard: GameCard): Promise<void> {
    if (!this.gameState) return;

    console.log(`🎯 执行AI出牌: ${player.name} -> ${cardId}`);
    
    // 第一步：显示出牌状态
    this.gameState.aiActionStatus = `${player.name}出牌`;
    this.emitGameUpdate();
    await this.delay(300); // 减少延迟确保状态及时更新

    const playCard = this.allCards.find(card => card.id === cardId);
    if (!playCard) {
      console.log(`❌ 找不到卡牌: ${cardId}`);
      return;
    }

    const directionChanged = this.isComplementaryHexagram(playCard, currentCard);

    // 第二步：执行出牌逻辑
    console.log(`🃏 ${player.name} 出牌 ${cardId}, 原手牌: ${player.cards.length}张`);
    player.cards = player.cards.filter(id => id !== cardId);
    this.gameState.currentCard = cardId;
    this.gameState.discardPile.push(cardId);
    console.log(`✅ 出牌完成, 剩余手牌: ${player.cards.length}张, 台面: ${cardId}`);

    if (directionChanged) {
      this.gameState.direction = this.gameState.direction === "clockwise" ? "counterclockwise" : "clockwise";
      console.log(`🔄 方向改变: ${this.gameState.direction}`);
      
      // 触发全局事件供前端监听
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gameDirectionChanged', {
          detail: { 
            direction: this.gameState.direction,
            player: player.name
          }
        }));
      }
    }

    // 第三步：立即更新状态
    this.gameState.aiActionStatus = "";
    this.emitGameUpdate();
    await this.delay(100); // 确保状态更新

    // 检查游戏结束
    if (player.cards.length === 0) {
      console.log(`🎉 ${player.name} 获胜！游戏结束`);
      this.gameState.aiActionStatus = ""; // 立即清除AI状态
      this.isProcessingAI = false; // 停止AI处理
      
      // 立即触发回合结束处理
      const result = this.handleRoundEnd(this.gameState.currentPlayer);
      this.emitGameUpdate();
      return;
    }

    // 第四步：切换到下一个玩家
    this.moveToNextPlayer();
    console.log(`➡️ 轮到下一个玩家: ${this.gameState.players[this.gameState.currentPlayer].name}`);
    this.emitGameUpdate();

    // 继续处理下一个玩家回合
    this.isProcessingAI = false;
    console.log(`✅ AI出牌回合 ${player.name} 处理完成`);
    setTimeout(() => this.processAITurns(), 800);
  }

  // AI抽牌
  private async executeAIDraw(player: Player, currentCard: GameCard): Promise<void> {
    if (!this.gameState) return;

    console.log(`🎯 执行AI抽牌: ${player.name}`);
    
    // 第一步：显示抽牌状态
    this.gameState.aiActionStatus = `${player.name}抽牌`;
    this.emitGameUpdate();
    await this.delay(200);

    // 标准UNO规则：抽一张牌，如果能出就立即出牌，否则结束回合
    const drawnCard = this.drawCardFromDeck();
    
    if (!drawnCard) {
      console.log(`❌ 牌堆空了`);
      // 牌堆空了，结束回合
      this.gameState.aiActionStatus = "";
      this.moveToNextPlayer();
      this.isProcessingAI = false;
      this.emitGameUpdate();
      console.log(`✅ AI抽牌回合 ${player.name} 处理完成 (牌堆空)`);
      setTimeout(() => this.processAITurns(), 800);
      return;
    }

    console.log(`🃏 ${player.name} 抽牌 ${drawnCard}, 原手牌: ${player.cards.length}张`);
    player.cards.push(drawnCard);
    console.log(`✅ 抽牌完成, 手牌: ${player.cards.length}张`);
    
    // 第二步：立即更新状态显示抽牌结果
    this.emitGameUpdate();
    await this.delay(100);
    
    const drawnCardData = this.allCards.find(c => c.id === drawnCard);
    if (drawnCardData && this.canPlayCard(drawnCardData, currentCard)) {
      console.log(`✨ 抽到可出的牌，立即出牌: ${drawnCard}`);
      // 抽到能出的牌，立即出牌
      await this.delay(300);
      await this.executeAIPlay(player, drawnCard, currentCard);
    } else {
      console.log(`➡️ 抽到不能出的牌，结束回合`);
      // 抽到不能出的牌，结束回合
      this.gameState.aiActionStatus = "";
      this.moveToNextPlayer();
      this.isProcessingAI = false;
      this.emitGameUpdate();
      console.log(`✅ AI抽牌回合 ${player.name} 处理完成`);
      setTimeout(() => this.processAITurns(), 800);
    }
  }

  // 回合结束处理
  private handleRoundEnd(winnerId: number): GameResult {
    if (!this.gameState) {
      return { success: false, gameState: this.gameState! };
    }

    console.log(`🏆 回合结束处理: 玩家 ${winnerId} 获胜`);
    
    // 计算分数变化
    this.gameState.players.forEach((player, index) => {
      if (index !== winnerId) {
        const penalty = -10 * player.cards.length;
        player.score += penalty;
        this.gameState!.scores[player.userId!] = player.score;
        console.log(`📊 ${player.name} 扣除 ${Math.abs(penalty)} 分，当前分数: ${player.score}`);
      }
    });

    // 检查特殊结算
    const eliminatedPlayers = this.gameState.players.filter(p => p.score <= 0);
    if (eliminatedPlayers.length > 0) {
      console.log(`🎯 特殊结算触发 - 有玩家分数归零`);
      this.gameState.status = "finished";
      this.emitGameUpdate();
      return { success: true, gameState: this.gameState };
    }

    // 普通回合结算 - 显示结算页面
    console.log(`📋 普通回合结算 - 显示结算页面`);
    this.gameState.status = "finished";
    this.emitGameUpdate();

    return { success: true, gameState: this.gameState };
  }

  // 开始新回合
  private startNewRound(): void {
    if (!this.gameState) return;

    // 重新洗牌发牌
    const allCardIds = this.allCards.map(card => card.id);
    const deck = this.shuffleArray([...allCardIds]);

    this.gameState.players.forEach(player => {
      player.cards = deck.splice(0, 5);
    });

    this.gameState.deck = deck;
    this.gameState.currentCard = deck.pop() || allCardIds[0];
    this.gameState.discardPile = [this.gameState.currentCard];
    this.gameState.currentPlayer = 0;
    this.gameState.direction = "clockwise";
    this.gameState.aiActionStatus = "";
    this.gameState.notifications = [];
  }

  // 重新开始游戏
  restartGame(): void {
    if (!this.gameState) return;

    // 根据当前战斗风格重置分数
    const initialScore = this.currentBattleStyle === "quick" ? 50 : 150;
    
    // 重置所有玩家分数
    this.gameState.players.forEach(player => {
      player.score = initialScore;
      this.gameState!.scores[player.userId!] = initialScore;
    });

    this.gameState.status = "playing";
    this.startNewRound();
    this.emitGameUpdate();

    // 开始AI回合
    setTimeout(() => this.processAITurns(), 1000);
  }

  // 开始下一轮（保持分数，重新发牌）  
  startNextRound(): void {
    if (!this.gameState) return;
    
    console.log(`🔄 开始下一轮游戏，保持当前分数`);
    // 保持当前分数，不重置
    // 只重新发牌和设置游戏状态
    
    console.log('🔄 开始下一轮游戏，保持当前分数');
    
    // 保存当前分数
    const currentScores = { ...this.gameState.scores };
    const currentPlayerScores = this.gameState.players.map(p => p.score);
    
    // 重新洗牌发牌（不重置分数）
    this.startNewRound();
    
    // 恢复分数（确保分数不被重置）
    this.gameState.scores = currentScores;
    this.gameState.players.forEach((player, index) => {
      player.score = currentPlayerScores[index];
    });
    this.gameState.scores = currentScores;
    this.gameState.players.forEach(player => {
      if (currentScores[player.userId!] !== undefined) {
        player.score = currentScores[player.userId!];
      }
    });
    
    // 重置游戏状态
    this.gameState.status = "playing";
    this.gameState.currentPlayer = 0; // 重新从人类玩家开始
    this.gameState.direction = "clockwise";
    this.gameState.aiActionStatus = "";
    
    this.emitGameUpdate();
    
    // 开始AI回合
    setTimeout(() => this.processAITurns(), 1000);
  }

  // 工具方法
  private canPlayCard(playCard: GameCard, currentCard: GameCard): boolean {
    const playElements = playCard.elements as string[];
    const currentElements = currentCard.elements as string[];
    
    return playElements.some(element => currentElements.includes(element));
  }

  private isComplementaryHexagram(playCard: GameCard, currentCard: GameCard): boolean {
    const playElements = playCard.elements as string[];
    const currentElements = currentCard.elements as string[];
    
    if (playElements.length !== 2 || currentElements.length !== 2) {
      return false;
    }
    
    return playElements[0] === currentElements[1] && playElements[1] === currentElements[0];
  }

  private moveToNextPlayer(): void {
    if (!this.gameState) return;

    const oldPlayer = this.gameState.currentPlayer;
    if (this.gameState.direction === "clockwise") {
      this.gameState.currentPlayer = (this.gameState.currentPlayer + 1) % this.gameState.players.length;
    } else {
      this.gameState.currentPlayer = (this.gameState.currentPlayer - 1 + this.gameState.players.length) % this.gameState.players.length;
    }
    console.log(`🔄 切换玩家: ${oldPlayer} -> ${this.gameState.currentPlayer} (${this.gameState.players[this.gameState.currentPlayer].name})`);
  }

  private drawCardFromDeck(): string | null {
    if (!this.gameState) return null;

    if (this.gameState.deck.length === 0) {
      this.refillDeck();
    }

    return this.gameState.deck.length > 0 ? this.gameState.deck.pop()! : null;
  }

  private refillDeck(): void {
    if (!this.gameState || this.gameState.discardPile.length <= 1) return;

    const currentCard = this.gameState.discardPile.pop()!;
    this.gameState.deck = this.shuffleArray([...this.gameState.discardPile]);
    this.gameState.discardPile = [currentCard];
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private emitGameUpdate(): void {
    if (!this.gameState) return;

    // 创建深拷贝避免引用问题
    const gameStateCopy = JSON.parse(JSON.stringify(this.gameState));
    
    console.log(`📡 发送状态更新事件: 当前牌=${gameStateCopy.currentCard}, AI状态=${gameStateCopy.aiActionStatus}`);
    
    const event = new CustomEvent('gameStateUpdate', {
      detail: gameStateCopy
    });
    
    // 确保事件能正确派发
    setTimeout(() => {
      this.eventTarget.dispatchEvent(event);
    }, 0);
  }

  private setupEventHandlers(): void {
    // 监听游戏结束事件 (由SimpleAIEngine触发)
    if (typeof window !== 'undefined') {
      window.addEventListener('gameRoundEnd', (event: any) => {
        const { playerId } = event.detail;
        console.log(`🎯 接收到游戏结束事件: 玩家${playerId}获胜`);
        
        if (this.gameState) {
          this.isProcessingAI = false; // 停止AI处理
          this.gameState.aiActionStatus = ""; // 清除AI状态
          this.handleRoundEnd(playerId);
          this.emitGameUpdate();
        }
      });
    }
  }

  // 获取游戏状态
  getGameState(): GameState | null {
    return this.gameState;
  }

  // 事件监听
  addEventListener(event: string, handler: (event: CustomEvent) => void): void {
    this.eventTarget.addEventListener(event, handler as EventListener);
  }

  removeEventListener(event: string, handler: (event: CustomEvent) => void): void {
    this.eventTarget.removeEventListener(event, handler as EventListener);
  }

  // === 技能系统扩展 ===
  
  /**
   * 检查战斗风格是否支持技能系统
   */
  private isSkillModeEnabled(): boolean {
    // 允许所有战斗模式使用技能系统
    return true;
  }

  /**
   * 人类玩家使用技能
   */
  async useSkill(element: string): Promise<{ success: boolean; message?: string }> {
    if (!this.gameState || !this.isSkillModeEnabled()) {
      return { success: false, message: "当前模式不支持技能系统" };
    }

    const currentPlayer = this.gameState.players[this.gameState.currentPlayer];
    if (currentPlayer.isAI) {
      return { success: false, message: "只有人类玩家可以手动触发技能" };
    }

    try {
      // 动态导入技能系统模块
      const { SkillExecutor } = await import("@/lib/skillSystem");
      
      // 验证技能执行条件
      const validation = SkillExecutor.validateSkillExecution(
        element as any, 
        currentPlayer.cards, 
        this.gameState.currentCard
      );
      
      if (!validation.valid) {
        return { success: false, message: validation.reason };
      }

      // 执行技能，传递playerId、当前分数和战斗模式用于奖励计算
      const result = SkillExecutor.executeElementSkill(
        element as any, 
        currentPlayer.cards, 
        this.gameState,
        currentPlayer.id,
        currentPlayer.score,
        this.currentBattleStyle
      );

      // 更新玩家手牌
      currentPlayer.cards = result.cardsRemaining;
      
      // 更新当前台面卡牌
      this.gameState.currentCard = result.finalCard;
      this.gameState.discardPile.push(result.finalCard);
      
      // 技能清牌奖励：只有清牌时才增加战斗分
      console.log(`🔍 检查技能清牌奖励: isSkillClear=${result.isSkillClear}, scoreBonus=${result.scoreBonus}, displayBonus=${result.displayBonus}, 玩家当前分数=${currentPlayer.score}`);
      console.log(`🔍 result对象完整内容:`, result);
      
      if (result.isSkillClear) {
        const oldScore = currentPlayer.score;
        
        console.log(`🎯 技能清牌确认: 玩家${currentPlayer.name}, 旧分数=${oldScore}, scoreBonus=${result.scoreBonus}, scoreBonus类型=${typeof result.scoreBonus}`);
        
        // 实际分数增加（可能为0如果已达上限）
        if (result.scoreBonus > 0) {
          console.log(`✅ 准备加分: ${oldScore} + ${result.scoreBonus} = ${oldScore + result.scoreBonus}`);
          currentPlayer.score += result.scoreBonus;
          if (currentPlayer.userId) {
            this.gameState.scores[currentPlayer.userId] = currentPlayer.score;
          }
          console.log(`✅ 加分完成: ${currentPlayer.name} 分数变为 ${currentPlayer.score}`);
        } else {
          console.log(`❌ 不加分: scoreBonus=${result.scoreBonus} 不大于0`);
        }
        
        console.log(`🎯 技能清牌处理: ${currentPlayer.name} 分数从 ${oldScore} 变为 ${currentPlayer.score} (实际+${result.scoreBonus}分), 显示奖励 ${result.displayBonus || 0} 分`);
        

      }

      // 发送技能使用事件
      console.log(`✨ 技能使用成功: ${currentPlayer.name} 使用了 ${result.skillUsed}`);
      
      // 检查胜利条件 - 技能清牌时等待动画完成
      if (currentPlayer.cards.length === 0) {
        console.log(`🎉 ${currentPlayer.name} 技能清牌致胜！等待动画完成...`);
        // 记录技能清牌信息
        if (result.isSkillClear) {
          (window as any).skillClearInfo = {
            playerId: currentPlayer.id,
            skillName: result.skillUsed,
            clearedCards: result.clearedCards || 0,
            bonusScore: result.scoreBonus || 0,
            displayBonus: result.displayBonus || (result.clearedCards || 0) * 10,
            finalScore: result.finalScore || currentPlayer.score
          };
        }
        // 等待技能动画完成（1.5秒）后再进入结算页面
        setTimeout(() => {
          console.log(`🎭 技能动画完成，进入结算页面`);
          this.handleRoundEnd(currentPlayer.id);
        }, 1500);
        return { success: true, message: "" };
      }

      // 🎯 技能系统不触发方向转换，直接切换到下一个玩家
      this.moveToNextPlayer();
      this.emitGameUpdate();
      
      // 继续AI回合
      setTimeout(() => this.processAITurns(), 1000);

      return { success: true, message: "" }; // 移除黑色提示消息
      
    } catch (error) {
      console.error("技能执行失败:", error);
      return { success: false, message: `技能执行失败: ${error instanceof Error ? error.message : "未知错误"}` };
    }
  }

  /**
   * AI玩家尝试使用技能
   */
  private async tryAISkill(player: any): Promise<boolean> {
    if (!this.gameState || !this.isSkillModeEnabled()) {
      return false;
    }

    try {
      const { SkillDetector, SkillAnalyzer } = require("@/lib/skillSystem");
      
      // 检测可用技能
      const opportunities = SkillDetector.checkElementResonance(
        this.gameState.currentCard,
        player.cards
      );

      if (opportunities.length === 0) {
        return false;
      }

      // 分析每个技能机会的价值
      for (const opportunity of opportunities) {
        const analysis = SkillAnalyzer.analyzeSkillValue(
          opportunity,
          this.gameState,
          player.id.toString()
        );

        // AI决策：如果技能价值足够高，就使用
        if (analysis.shouldUse) {
          console.log(`🤖 ${player.name} 决定使用技能: ${opportunity.skillName}`);
          
          const skillResult = await this.useSkill(opportunity.element);
          if (skillResult.success) {
            console.log(`✅ ${player.name} 成功使用技能: ${skillResult.message}`);
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error(`AI技能处理错误:`, error);
      return false;
    }
  }



  /**
   * 获取当前玩家的可用技能
   */
  getAvailableSkills(): any[] {
    if (!this.gameState || !this.isSkillModeEnabled()) {
      return [];
    }

    const currentPlayer = this.gameState.players[this.gameState.currentPlayer];
    if (currentPlayer.isAI) {
      return [];
    }

    try {
      const { SkillDetector } = require("@/lib/skillSystem");
      return SkillDetector.checkElementResonance(
        this.gameState.currentCard,
        currentPlayer.cards
      );
    } catch (error) {
      console.error("获取技能失败:", error);
      return [];
    }
  }
}