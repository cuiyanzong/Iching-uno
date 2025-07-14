import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  hostId: integer("host_id").notNull(),
  status: text("status").notNull().default("waiting"), // waiting, playing, finished
  currentPlayer: integer("current_player").notNull().default(0),
  direction: text("direction").notNull().default("clockwise"), // clockwise, counterclockwise
  players: jsonb("players").notNull(), // array of player objects
  deck: jsonb("deck").notNull(), // array of card IDs
  discardPile: jsonb("discard_pile").notNull(), // array of card IDs
  currentCard: text("current_card"), // current card ID
  scores: jsonb("scores").notNull(), // player scores object
  round: integer("round").notNull().default(1),
});

export const gameCards = pgTable("game_cards", {
  id: text("id").primaryKey(), // hexagram ID like "fire_sky_dayou"
  name: text("name").notNull(), // Chinese name like "大有"
  elements: jsonb("elements").notNull(), // array of element strings
  type: text("type").notNull().default("normal"), // normal, reverse
  color: text("color").notNull(), // primary color
  description: text("description"),
});

export const globalLeaderboard = pgTable("global_leaderboard", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  deviceId: text("device_id").notNull(),
  totalScore: integer("total_score").notNull().default(0),
  gamesPlayed: integer("games_played").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  defeats: integer("defeats").notNull().default(0),
  clearCards: integer("clear_cards").notNull().default(0),
  smallWins: integer("small_wins").notNull().default(0),
  doubleKills: integer("double_kills").notNull().default(0),
  quadKills: integer("quad_kills").notNull().default(0),
  uploadDate: timestamp("upload_date").defaultNow(),
  lastPlayed: timestamp("last_played").defaultNow(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
});

export const insertGameCardSchema = createInsertSchema(gameCards);

export const insertGlobalLeaderboardSchema = createInsertSchema(globalLeaderboard).omit({
  id: true,
  uploadDate: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type GameCard = typeof gameCards.$inferSelect;
export type InsertGameCard = z.infer<typeof insertGameCardSchema>;
export type GlobalLeaderboard = typeof globalLeaderboard.$inferSelect;
export type InsertGlobalLeaderboard = z.infer<typeof insertGlobalLeaderboardSchema>;

// Game-specific types
export type Element = "fire" | "water" | "mountain" | "lake" | "earth" | "sky" | "thunder" | "wind";

export type Player = {
  id: number;
  name: string;
  cards: string[]; // array of card IDs
  score: number;
  isAI: boolean;
  userId?: number; // For real players
};

export type GameMode = "single";

export type BattleStyle = "quick" | "strategic";

export interface BattleStyleConfig {
  style: BattleStyle;
  initialScore: number;
  name: string;
  description: string;
  features: string;
}

export type GameNotification = {
  type: "player_joined" | "player_left";
  message: string;
  timestamp: number;
};

export type GameState = {
  id: number;
  hostId: number;
  status: "waiting" | "playing" | "finished";
  mode: GameMode;
  battleStyle?: BattleStyle; // 战斗风格
  currentPlayer: number;
  direction: "clockwise" | "counterclockwise";
  players: Player[];
  deck: string[];
  discardPile: string[];
  currentCard: string | null;
  scores: Record<number, number>;
  round: number;
  maxPlayers: number;
  aiActionStatus?: string; // Display AI action status like "阿豪抽牌", "老宋出牌"
  // AI助手状态 - 简化版本
  aiAssistant?: {
    active: boolean;           // AI助手是否激活
    targetPlayerId: number;    // 目标人类玩家ID
    showCountdown: boolean;    // 是否显示倒计时
    isAssisting: boolean;      // 是否正在辅助操作
    lastUpdate: number;        // 最后更新时间戳
  };
  // 永久积分相关数据（可选，用于在结算时临时存储）
  permanentScoreChanges?: {
    playerId: string;
    playerName: string;
    oldScore: number;
    newScore: number;
    change: number;
    reason: string;
  }[];
};
