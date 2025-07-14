import { users, games, gameCards, globalLeaderboard, type User, type InsertUser, type Game, type InsertGame, type GameCard, type GameState, type Player, type GlobalLeaderboard, type InsertGlobalLeaderboard } from "@shared/schema";
import { hexagramsData } from "../shared/hexagrams";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createGame(hostId: number, mode?: "single", playerName?: string): Promise<GameState>;
  getGame(id: number): Promise<GameState | undefined>;
  getAllGames(): Promise<GameState[]>;
  updateGame(gameState: GameState): Promise<GameState>;
  deleteGame(id: number): Promise<void>;
  
  getAllCards(): Promise<GameCard[]>;
  getCard(id: string): Promise<GameCard | undefined>;
  
  // 全球排行榜
  uploadToLeaderboard(data: InsertGlobalLeaderboard): Promise<GlobalLeaderboard>;
  getGlobalLeaderboard(): Promise<GlobalLeaderboard[]>;
  checkDeviceUploaded(deviceId: string): Promise<boolean>;
  checkPlayerName(playerName: string): Promise<GlobalLeaderboard | null>;
  updateLeaderboard(playerName: string, data: InsertGlobalLeaderboard): Promise<GlobalLeaderboard>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, GameState>;
  private cards: Map<string, GameCard>;
  private currentUserId: number;
  private currentGameId: number;
  private readonly AI_NAMES = ["阿豪", "老宋", "阿宗", "小李", "小王", "小张", "小陈", "老刘"];
  private cardIds: string[] = []; // 缓存所有卡牌ID

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.cards = new Map();
    this.currentUserId = 1;
    this.currentGameId = 1;
    this.cardIds = []; // 初始化卡牌ID缓存
    this.initializeCards();
  }

  private initializeCards() {
    // Initialize all 64 hexagram cards
    hexagramsData.forEach(hexagram => {
      this.cards.set(hexagram.id, hexagram);
      this.cardIds.push(hexagram.id); // 缓存卡牌ID
    });
  }

  // 优化：获取所有卡牌ID的快速方法
  public getAllCardIds(): string[] {
    return [...this.cardIds];
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // 生成真正唯一的用户ID，避免冲突
    let id = Date.now() + Math.floor(Math.random() * 100000);
    
    // 确保ID绝对唯一
    while (this.users.has(id)) {
      id = Date.now() + Math.floor(Math.random() * 100000) + Math.floor(Math.random() * 1000);
    }
    
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Game methods
  async createGame(hostId: number, mode: "single" = "single", playerName: string = "玩家"): Promise<GameState> {
    const id = this.currentGameId++;
    
    // Create AI players
    const aiNames = ["阿豪", "老宋", "阿宗"];
    const players: Player[] = [
      {
        id: 0, // 玩家使用游戏内序号0
        name: playerName,
        cards: [],
        score: 150,
        isAI: false,
        userId: hostId // 正确设置userId用于身份验证
      }
    ];

    // Add 3 AI players
    for (let i = 0; i < 3; i++) {
      players.push({
        id: i + 1, // AI玩家使用游戏内序号1, 2, 3
        name: aiNames[i],
        cards: [],
        score: 150,
        isAI: true
        // AI玩家不需要userId，因为它们不进行身份验证
      });
    }

    // Initialize deck with all card IDs
    const deck = Array.from(this.cards.keys());
    this.shuffleDeck(deck);

    // Deal 5 cards to each player
    players.forEach(player => {
      for (let i = 0; i < 5; i++) {
        const card = deck.pop();
        if (card) {
          player.cards.push(card);
        }
      }
    });

    // Set first card from deck as current card
    const currentCard = deck.pop() || null;

    const gameState: GameState = {
      id,
      hostId,
      status: "playing", // Start game immediately with AI players
      mode: "single", // Only support single player mode
      currentPlayer: 0,
      direction: "clockwise",
      players: players, // Include all players (host + 3 AI) from start
      deck,
      discardPile: currentCard ? [currentCard] : [],
      currentCard,
      scores: players.reduce((acc, player) => {
        acc[player.id] = player.score;
        return acc;
      }, {} as Record<number, number>),
      round: 1,
      maxPlayers: 4
    };

    this.games.set(id, gameState);
    return gameState;
  }

  async getGame(id: number): Promise<GameState | undefined> {
    return this.games.get(id);
  }

  async getAllGames(): Promise<GameState[]> {
    return Array.from(this.games.values());
  }

  async updateGame(gameState: GameState): Promise<GameState> {
    this.games.set(gameState.id, gameState);
    return gameState;
  }

  // Simple cleanup for single player games
  async cleanGameData(gameId: number): Promise<void> {
    const game = this.games.get(gameId);
    if (!game) return;

    // Reset player scores
    game.players.forEach(player => {
      player.score = 150;
      game.scores[player.id] = 150;
    });
    
    // Reset game progress
    game.round = 1;
    game.discardPile = [];
    game.aiActionStatus = undefined;
    
    await this.updateGame(game);
  }

  async deleteGame(id: number): Promise<void> {
    this.games.delete(id);
  }



  // Get available AI names that don't conflict with existing players
  private getAvailableAIName(game: GameState): string {
    const existingNames = game.players.map(p => p.name);
    for (const name of this.AI_NAMES) {
      if (!existingNames.includes(name)) {
        return name;
      }
    }
    // Fallback to numbered AI if all names are taken
    let counter = 1;
    while (existingNames.includes(`AI${counter}`)) {
      counter++;
    }
    return `AI${counter}`;
  }

  async getAllCards(): Promise<GameCard[]> {
    return Array.from(this.cards.values());
  }

  async getCard(id: string): Promise<GameCard | undefined> {
    return this.cards.get(id);
  }

  // 全球排行榜 - 在内存存储中暂时不实现
  async uploadToLeaderboard(data: InsertGlobalLeaderboard): Promise<GlobalLeaderboard> {
    throw new Error("全球排行榜功能需要数据库支持");
  }

  async getGlobalLeaderboard(): Promise<GlobalLeaderboard[]> {
    return [];
  }

  async checkDeviceUploaded(deviceId: string): Promise<boolean> {
    return false;
  }

  private shuffleDeck(deck: string[]): void {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }
}

// Use database storage for global leaderboard features
import { DatabaseStorage } from "./storage/DatabaseStorage";

// Create a hybrid storage that uses MemStorage for games and DatabaseStorage for leaderboard
class HybridStorage implements IStorage {
  private memStorage = new MemStorage();
  private dbStorage = new DatabaseStorage();

  async getUser(id: number): Promise<User | undefined> {
    return this.memStorage.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.memStorage.getUserByUsername(username);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.memStorage.createUser(user);
  }

  async createGame(hostId: number, mode?: "single", playerName?: string): Promise<GameState> {
    return this.memStorage.createGame(hostId, mode, playerName);
  }

  async getGame(id: number): Promise<GameState | undefined> {
    return this.memStorage.getGame(id);
  }

  async getAllGames(): Promise<GameState[]> {
    return this.memStorage.getAllGames();
  }

  async updateGame(gameState: GameState): Promise<GameState> {
    return this.memStorage.updateGame(gameState);
  }

  async deleteGame(id: number): Promise<void> {
    return this.memStorage.deleteGame(id);
  }

  async getAllCards(): Promise<GameCard[]> {
    return this.memStorage.getAllCards();
  }

  async getCard(id: string): Promise<GameCard | undefined> {
    return this.memStorage.getCard(id);
  }

  // Use database storage for global leaderboard
  async uploadToLeaderboard(data: InsertGlobalLeaderboard): Promise<GlobalLeaderboard> {
    return this.dbStorage.uploadToLeaderboard(data);
  }

  async getGlobalLeaderboard(): Promise<GlobalLeaderboard[]> {
    return this.dbStorage.getGlobalLeaderboard();
  }

  async checkDeviceUploaded(deviceId: string): Promise<boolean> {
    return this.dbStorage.checkDeviceUploaded(deviceId);
  }

  async checkPlayerName(playerName: string): Promise<GlobalLeaderboard | null> {
    return this.dbStorage.checkPlayerName(playerName);
  }

  async updateLeaderboard(playerName: string, data: InsertGlobalLeaderboard): Promise<GlobalLeaderboard> {
    return this.dbStorage.updateLeaderboard(playerName, data);
  }
}

export const storage = new HybridStorage();
