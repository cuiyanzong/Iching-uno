import { users, games, gameCards, globalLeaderboard, type User, type InsertUser, type Game, type InsertGame, type GameCard, type GameState, type Player, type GlobalLeaderboard, type InsertGlobalLeaderboard } from "@shared/schema";
import { hexagramsData } from "../../shared/hexagrams";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";
import type { IStorage } from "../storage";

export class DatabaseStorage implements IStorage {
  private readonly AI_NAMES = ["阿豪", "老宋", "阿宗", "小李", "小王", "小张", "小陈", "老刘"];
  private cardIds: string[] = [];
  private currentGameId: number = 1;
  private currentUserId: number = 1;
  private games: Map<number, GameState> = new Map();
  private cards: Map<string, GameCard> = new Map();

  constructor() {
    this.initializeCards();
  }

  private initializeCards() {
    hexagramsData.forEach(card => {
      this.cards.set(card.id, card);
      this.cardIds.push(card.id);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createGame(hostId: number, mode: "single" = "single", playerName: string = "玩家"): Promise<GameState> {
    const gameId = this.currentGameId++;
    const shuffledDeck = [...this.cardIds];
    this.shuffleDeck(shuffledDeck);

    const players: Player[] = [{
      id: 0,
      name: playerName,
      cards: shuffledDeck.splice(0, 7),
      score: 0,
      isAI: false,
      userId: hostId,
    }];

    // Add AI players
    for (let i = 1; i <= 3; i++) {
      const aiName = this.getAvailableAIName({ players } as GameState);
      players.push({
        id: i,
        name: aiName,
        cards: shuffledDeck.splice(0, 7),
        score: 0,
        isAI: true,
      });
    }

    const currentCard = shuffledDeck.pop()!;
    const gameState: GameState = {
      id: gameId,
      hostId,
      status: "playing",
      mode,
      currentPlayer: 0,
      direction: "clockwise",
      players,
      deck: shuffledDeck,
      discardPile: [],
      currentCard,
      scores: players.reduce((acc, player) => {
        acc[player.id] = 0;
        return acc;
      }, {} as Record<number, number>),
      round: 1,
      maxPlayers: 4,
      aiActionStatus: "",
    };

    this.games.set(gameId, gameState);
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

  async deleteGame(id: number): Promise<void> {
    this.games.delete(id);
  }

  async getAllCards(): Promise<GameCard[]> {
    return Array.from(this.cards.values());
  }

  async getCard(id: string): Promise<GameCard | undefined> {
    return this.cards.get(id);
  }

  // 全球排行榜实现
  async uploadToLeaderboard(data: InsertGlobalLeaderboard): Promise<GlobalLeaderboard> {
    try {
      const [result] = await db.insert(globalLeaderboard).values(data).returning();
      return result;
    } catch (error) {
      console.error('上传排行榜失败:', error);
      throw error;
    }
  }

  async getGlobalLeaderboard(): Promise<GlobalLeaderboard[]> {
    try {
      const results = await db
        .select()
        .from(globalLeaderboard)
        .orderBy(desc(globalLeaderboard.totalScore))
        .limit(100);
      return results;
    } catch (error) {
      console.error('获取排行榜失败:', error);
      return [];
    }
  }

  async checkDeviceUploaded(deviceId: string): Promise<boolean> {
    try {
      const [result] = await db
        .select()
        .from(globalLeaderboard)
        .where(eq(globalLeaderboard.deviceId, deviceId))
        .limit(1);
      return !!result;
    } catch (error) {
      console.error('检查设备上传状态失败:', error);
      return false;
    }
  }

  async checkPlayerName(playerName: string): Promise<GlobalLeaderboard | null> {
    try {
      const [result] = await db
        .select()
        .from(globalLeaderboard)
        .where(eq(globalLeaderboard.playerName, playerName))
        .orderBy(desc(globalLeaderboard.totalScore))
        .limit(1);
      return result || null;
    } catch (error) {
      console.error('检查玩家名称失败:', error);
      return null;
    }
  }

  async updateLeaderboard(playerName: string, data: InsertGlobalLeaderboard): Promise<GlobalLeaderboard> {
    try {
      const [result] = await db
        .update(globalLeaderboard)
        .set(data)
        .where(eq(globalLeaderboard.playerName, playerName))
        .returning();
      return result;
    } catch (error) {
      console.error('更新排行榜失败:', error);
      throw error;
    }
  }

  private getAvailableAIName(game: GameState): string {
    const usedNames = game.players.map(p => p.name);
    const availableNames = this.AI_NAMES.filter(name => !usedNames.includes(name));
    return availableNames[Math.floor(Math.random() * availableNames.length)] || "AI玩家";
  }

  private shuffleDeck(deck: string[]): void {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }
}