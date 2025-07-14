var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";
import { createServer } from "http";

// shared/hexagrams.ts
var hexagramsData = [
  // 乾为天 (Pure Sky)
  {
    id: "sky_sky_qian",
    name: "\u4E7E",
    elements: ["sky", "sky"],
    type: "normal",
    color: "white",
    description: "\u4E7E\u4E3A\u5929"
  },
  // 坤为地 (Pure Earth)
  {
    id: "earth_earth_kun",
    name: "\u5764",
    elements: ["earth", "earth"],
    type: "normal",
    color: "black",
    description: "\u5764\u4E3A\u5730"
  },
  // 水雷屯
  {
    id: "water_thunder_zhun",
    name: "\u5C6F",
    elements: ["water", "thunder"],
    type: "normal",
    color: "blue",
    description: "\u6C34\u96F7\u5C6F"
  },
  // 山水蒙
  {
    id: "mountain_water_meng",
    name: "\u8499",
    elements: ["mountain", "water"],
    type: "normal",
    color: "green",
    description: "\u5C71\u6C34\u8499"
  },
  // 水天需
  {
    id: "water_sky_xu",
    name: "\u9700",
    elements: ["water", "sky"],
    type: "normal",
    color: "blue",
    description: "\u6C34\u5929\u9700"
  },
  // 天水讼
  {
    id: "sky_water_song",
    name: "\u8BBC",
    elements: ["sky", "water"],
    type: "normal",
    color: "white",
    description: "\u5929\u6C34\u8BBC"
  },
  // 地水师
  {
    id: "earth_water_shi",
    name: "\u5E08",
    elements: ["earth", "water"],
    type: "normal",
    color: "black",
    description: "\u5730\u6C34\u5E08"
  },
  // 水地比
  {
    id: "water_earth_bi",
    name: "\u6BD4",
    elements: ["water", "earth"],
    type: "normal",
    color: "blue",
    description: "\u6C34\u5730\u6BD4"
  },
  // 风天小畜
  {
    id: "wind_sky_xiaoxu",
    name: "\u5C0F\u755C",
    elements: ["wind", "sky"],
    type: "normal",
    color: "cyan",
    description: "\u98CE\u5929\u5C0F\u755C"
  },
  // 天泽履
  {
    id: "sky_lake_lv",
    name: "\u5C65",
    elements: ["sky", "lake"],
    type: "normal",
    color: "white",
    description: "\u5929\u6CFD\u5C65"
  },
  // 地天泰
  {
    id: "earth_sky_tai",
    name: "\u6CF0",
    elements: ["earth", "sky"],
    type: "normal",
    color: "black",
    description: "\u5730\u5929\u6CF0"
  },
  // 天地否
  {
    id: "sky_earth_pi",
    name: "\u5426",
    elements: ["sky", "earth"],
    type: "normal",
    color: "white",
    description: "\u5929\u5730\u5426"
  },
  // 天火同人
  {
    id: "sky_fire_tongren",
    name: "\u540C\u4EBA",
    elements: ["sky", "fire"],
    type: "normal",
    color: "white",
    description: "\u5929\u706B\u540C\u4EBA"
  },
  // 火天大有
  {
    id: "fire_sky_dayou",
    name: "\u5927\u6709",
    elements: ["fire", "sky"],
    type: "normal",
    color: "red",
    description: "\u706B\u5929\u5927\u6709"
  },
  // 地山谦
  {
    id: "earth_mountain_qian",
    name: "\u8C26",
    elements: ["earth", "mountain"],
    type: "normal",
    color: "black",
    description: "\u5730\u5C71\u8C26"
  },
  // 雷地豫
  {
    id: "thunder_earth_yu",
    name: "\u8C6B",
    elements: ["thunder", "earth"],
    type: "normal",
    color: "yellow",
    description: "\u96F7\u5730\u8C6B"
  },
  // 泽雷随
  {
    id: "lake_thunder_sui",
    name: "\u968F",
    elements: ["lake", "thunder"],
    type: "normal",
    color: "amber",
    description: "\u6CFD\u96F7\u968F"
  },
  // 山风蛊
  {
    id: "mountain_wind_gu",
    name: "\u86CA",
    elements: ["mountain", "wind"],
    type: "normal",
    color: "green",
    description: "\u5C71\u98CE\u86CA"
  },
  // 地泽临
  {
    id: "earth_lake_lin",
    name: "\u4E34",
    elements: ["earth", "lake"],
    type: "normal",
    color: "black",
    description: "\u5730\u6CFD\u4E34"
  },
  // 风地观
  {
    id: "wind_earth_guan",
    name: "\u89C2",
    elements: ["wind", "earth"],
    type: "normal",
    color: "cyan",
    description: "\u98CE\u5730\u89C2"
  },
  // 火雷噬嗑
  {
    id: "fire_thunder_shike",
    name: "\u566C\u55D1",
    elements: ["fire", "thunder"],
    type: "normal",
    color: "red",
    description: "\u706B\u96F7\u566C\u55D1"
  },
  // 山火贲
  {
    id: "mountain_fire_bi",
    name: "\u8D32",
    elements: ["mountain", "fire"],
    type: "normal",
    color: "green",
    description: "\u5C71\u706B\u8D32"
  },
  // 山地剥
  {
    id: "mountain_earth_bo",
    name: "\u5265",
    elements: ["mountain", "earth"],
    type: "normal",
    color: "green",
    description: "\u5C71\u5730\u5265"
  },
  // 地雷复
  {
    id: "earth_thunder_fu",
    name: "\u590D",
    elements: ["earth", "thunder"],
    type: "normal",
    color: "black",
    description: "\u5730\u96F7\u590D"
  },
  // 天雷无妄
  {
    id: "sky_thunder_wuwang",
    name: "\u65E0\u5984",
    elements: ["sky", "thunder"],
    type: "normal",
    color: "white",
    description: "\u5929\u96F7\u65E0\u5984"
  },
  // 山天大畜
  {
    id: "mountain_sky_daxu",
    name: "\u5927\u755C",
    elements: ["mountain", "sky"],
    type: "normal",
    color: "green",
    description: "\u5C71\u5929\u5927\u755C"
  },
  // 山雷颐
  {
    id: "mountain_thunder_yi",
    name: "\u9890",
    elements: ["mountain", "thunder"],
    type: "normal",
    color: "green",
    description: "\u5C71\u96F7\u9890"
  },
  // 泽风大过
  {
    id: "lake_wind_daguo",
    name: "\u5927\u8FC7",
    elements: ["lake", "wind"],
    type: "normal",
    color: "amber",
    description: "\u6CFD\u98CE\u5927\u8FC7"
  },
  // 坎为水
  {
    id: "water_water_kan",
    name: "\u574E",
    elements: ["water", "water"],
    type: "normal",
    color: "blue",
    description: "\u574E\u4E3A\u6C34"
  },
  // 离为火
  {
    id: "fire_fire_li",
    name: "\u79BB",
    elements: ["fire", "fire"],
    type: "normal",
    color: "red",
    description: "\u79BB\u4E3A\u706B"
  },
  // 泽山咸
  {
    id: "lake_mountain_xian",
    name: "\u54B8",
    elements: ["lake", "mountain"],
    type: "normal",
    color: "amber",
    description: "\u6CFD\u5C71\u54B8"
  },
  // 雷风恒
  {
    id: "thunder_wind_heng",
    name: "\u6052",
    elements: ["thunder", "wind"],
    type: "normal",
    color: "yellow",
    description: "\u96F7\u98CE\u6052"
  },
  // 天山遁
  {
    id: "sky_mountain_dun",
    name: "\u9041",
    elements: ["sky", "mountain"],
    type: "normal",
    color: "white",
    description: "\u5929\u5C71\u9041"
  },
  // 雷天大壮
  {
    id: "thunder_sky_dazhuang",
    name: "\u5927\u58EE",
    elements: ["thunder", "sky"],
    type: "normal",
    color: "yellow",
    description: "\u96F7\u5929\u5927\u58EE"
  },
  // 火地晋
  {
    id: "fire_earth_jin",
    name: "\u664B",
    elements: ["fire", "earth"],
    type: "normal",
    color: "red",
    description: "\u706B\u5730\u664B"
  },
  // 地火明夷
  {
    id: "earth_fire_mingyi",
    name: "\u660E\u5937",
    elements: ["earth", "fire"],
    type: "normal",
    color: "black",
    description: "\u5730\u706B\u660E\u5937"
  },
  // 风火家人
  {
    id: "wind_fire_jiaren",
    name: "\u5BB6\u4EBA",
    elements: ["wind", "fire"],
    type: "normal",
    color: "cyan",
    description: "\u98CE\u706B\u5BB6\u4EBA"
  },
  // 火泽睽
  {
    id: "fire_lake_kui",
    name: "\u777D",
    elements: ["fire", "lake"],
    type: "normal",
    color: "red",
    description: "\u706B\u6CFD\u777D"
  },
  // 水山蹇
  {
    id: "water_mountain_jian",
    name: "\u8E47",
    elements: ["water", "mountain"],
    type: "normal",
    color: "blue",
    description: "\u6C34\u5C71\u8E47"
  },
  // 雷水解
  {
    id: "thunder_water_jie",
    name: "\u89E3",
    elements: ["thunder", "water"],
    type: "normal",
    color: "yellow",
    description: "\u96F7\u6C34\u89E3"
  },
  // 山泽损
  {
    id: "mountain_lake_sun",
    name: "\u635F",
    elements: ["mountain", "lake"],
    type: "normal",
    color: "green",
    description: "\u5C71\u6CFD\u635F"
  },
  // 风雷益
  {
    id: "wind_thunder_yi",
    name: "\u76CA",
    elements: ["wind", "thunder"],
    type: "normal",
    color: "cyan",
    description: "\u98CE\u96F7\u76CA"
  },
  // 泽天夬
  {
    id: "lake_sky_guai",
    name: "\u592C",
    elements: ["lake", "sky"],
    type: "normal",
    color: "amber",
    description: "\u6CFD\u5929\u592C"
  },
  // 天风姤
  {
    id: "sky_wind_gou",
    name: "\u59E4",
    elements: ["sky", "wind"],
    type: "normal",
    color: "white",
    description: "\u5929\u98CE\u59E4"
  },
  // 泽地萃
  {
    id: "lake_earth_cui",
    name: "\u8403",
    elements: ["lake", "earth"],
    type: "normal",
    color: "amber",
    description: "\u6CFD\u5730\u8403"
  },
  // 地风升
  {
    id: "earth_wind_sheng",
    name: "\u5347",
    elements: ["earth", "wind"],
    type: "normal",
    color: "black",
    description: "\u5730\u98CE\u5347"
  },
  // 泽水困
  {
    id: "lake_water_kun",
    name: "\u56F0",
    elements: ["lake", "water"],
    type: "normal",
    color: "amber",
    description: "\u6CFD\u6C34\u56F0"
  },
  // 水风井
  {
    id: "water_wind_jing",
    name: "\u4E95",
    elements: ["water", "wind"],
    type: "normal",
    color: "blue",
    description: "\u6C34\u98CE\u4E95"
  },
  // 泽火革
  {
    id: "lake_fire_ge",
    name: "\u9769",
    elements: ["lake", "fire"],
    type: "normal",
    color: "amber",
    description: "\u6CFD\u706B\u9769"
  },
  // 火风鼎
  {
    id: "fire_wind_ding",
    name: "\u9F0E",
    elements: ["fire", "wind"],
    type: "normal",
    color: "red",
    description: "\u706B\u98CE\u9F0E"
  },
  // 震为雷
  {
    id: "thunder_thunder_zhen",
    name: "\u9707",
    elements: ["thunder", "thunder"],
    type: "normal",
    color: "yellow",
    description: "\u9707\u4E3A\u96F7"
  },
  // 艮为山
  {
    id: "mountain_mountain_gen",
    name: "\u826E",
    elements: ["mountain", "mountain"],
    type: "normal",
    color: "green",
    description: "\u826E\u4E3A\u5C71"
  },
  // 风山渐
  {
    id: "wind_mountain_jian",
    name: "\u6E10",
    elements: ["wind", "mountain"],
    type: "normal",
    color: "cyan",
    description: "\u98CE\u5C71\u6E10"
  },
  // 雷泽归妹
  {
    id: "thunder_lake_guimei",
    name: "\u5F52\u59B9",
    elements: ["thunder", "lake"],
    type: "normal",
    color: "yellow",
    description: "\u96F7\u6CFD\u5F52\u59B9"
  },
  // 雷火丰
  {
    id: "thunder_fire_feng",
    name: "\u4E30",
    elements: ["thunder", "fire"],
    type: "normal",
    color: "yellow",
    description: "\u96F7\u706B\u4E30"
  },
  // 火山旅
  {
    id: "fire_mountain_lv",
    name: "\u65C5",
    elements: ["fire", "mountain"],
    type: "normal",
    color: "red",
    description: "\u706B\u5C71\u65C5"
  },
  // 巽为风
  {
    id: "wind_wind_xun",
    name: "\u5DFD",
    elements: ["wind", "wind"],
    type: "normal",
    color: "cyan",
    description: "\u5DFD\u4E3A\u98CE"
  },
  // 兑为泽
  {
    id: "lake_lake_dui",
    name: "\u5151",
    elements: ["lake", "lake"],
    type: "normal",
    color: "amber",
    description: "\u5151\u4E3A\u6CFD"
  },
  // 风水涣
  {
    id: "wind_water_huan",
    name: "\u6DA3",
    elements: ["wind", "water"],
    type: "normal",
    color: "cyan",
    description: "\u98CE\u6C34\u6DA3"
  },
  // 水泽节
  {
    id: "water_lake_jie",
    name: "\u8282",
    elements: ["water", "lake"],
    type: "normal",
    color: "blue",
    description: "\u6C34\u6CFD\u8282"
  },
  // 风泽中孚
  {
    id: "wind_lake_zhongfu",
    name: "\u4E2D\u5B5A",
    elements: ["wind", "lake"],
    type: "normal",
    color: "cyan",
    description: "\u98CE\u6CFD\u4E2D\u5B5A"
  },
  // 雷山小过
  {
    id: "thunder_mountain_xiaoguo",
    name: "\u5C0F\u8FC7",
    elements: ["thunder", "mountain"],
    type: "normal",
    color: "yellow",
    description: "\u96F7\u5C71\u5C0F\u8FC7"
  },
  // 水火既济
  {
    id: "water_fire_jiji",
    name: "\u65E2\u6D4E",
    elements: ["water", "fire"],
    type: "normal",
    color: "blue",
    description: "\u6C34\u706B\u65E2\u6D4E"
  },
  // 火水未济
  {
    id: "fire_water_weiji",
    name: "\u672A\u6D4E",
    elements: ["fire", "water"],
    type: "normal",
    color: "red",
    description: "\u706B\u6C34\u672A\u6D4E"
  }
];

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  gameCards: () => gameCards,
  games: () => games,
  globalLeaderboard: () => globalLeaderboard,
  insertGameCardSchema: () => insertGameCardSchema,
  insertGameSchema: () => insertGameSchema,
  insertGlobalLeaderboardSchema: () => insertGlobalLeaderboardSchema,
  insertUserSchema: () => insertUserSchema,
  users: () => users
});
import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var games = pgTable("games", {
  id: serial("id").primaryKey(),
  hostId: integer("host_id").notNull(),
  status: text("status").notNull().default("waiting"),
  // waiting, playing, finished
  currentPlayer: integer("current_player").notNull().default(0),
  direction: text("direction").notNull().default("clockwise"),
  // clockwise, counterclockwise
  players: jsonb("players").notNull(),
  // array of player objects
  deck: jsonb("deck").notNull(),
  // array of card IDs
  discardPile: jsonb("discard_pile").notNull(),
  // array of card IDs
  currentCard: text("current_card"),
  // current card ID
  scores: jsonb("scores").notNull(),
  // player scores object
  round: integer("round").notNull().default(1)
});
var gameCards = pgTable("game_cards", {
  id: text("id").primaryKey(),
  // hexagram ID like "fire_sky_dayou"
  name: text("name").notNull(),
  // Chinese name like "大有"
  elements: jsonb("elements").notNull(),
  // array of element strings
  type: text("type").notNull().default("normal"),
  // normal, reverse
  color: text("color").notNull(),
  // primary color
  description: text("description")
});
var globalLeaderboard = pgTable("global_leaderboard", {
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
  lastPlayed: timestamp("last_played").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertGameSchema = createInsertSchema(games).omit({
  id: true
});
var insertGameCardSchema = createInsertSchema(gameCards);
var insertGlobalLeaderboardSchema = createInsertSchema(globalLeaderboard).omit({
  id: true,
  uploadDate: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage/DatabaseStorage.ts
import { eq, desc } from "drizzle-orm";
var DatabaseStorage = class {
  constructor() {
    this.AI_NAMES = ["\u963F\u8C6A", "\u8001\u5B8B", "\u963F\u5B97", "\u5C0F\u674E", "\u5C0F\u738B", "\u5C0F\u5F20", "\u5C0F\u9648", "\u8001\u5218"];
    this.cardIds = [];
    this.currentGameId = 1;
    this.currentUserId = 1;
    this.games = /* @__PURE__ */ new Map();
    this.cards = /* @__PURE__ */ new Map();
    this.initializeCards();
  }
  initializeCards() {
    hexagramsData.forEach((card) => {
      this.cards.set(card.id, card);
      this.cardIds.push(card.id);
    });
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async createGame(hostId, mode = "single", playerName = "\u73A9\u5BB6") {
    const gameId = this.currentGameId++;
    const shuffledDeck = [...this.cardIds];
    this.shuffleDeck(shuffledDeck);
    const players = [{
      id: 0,
      name: playerName,
      cards: shuffledDeck.splice(0, 7),
      score: 0,
      isAI: false,
      userId: hostId
    }];
    for (let i = 1; i <= 3; i++) {
      const aiName = this.getAvailableAIName({ players });
      players.push({
        id: i,
        name: aiName,
        cards: shuffledDeck.splice(0, 7),
        score: 0,
        isAI: true
      });
    }
    const currentCard = shuffledDeck.pop();
    const gameState = {
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
      }, {}),
      round: 1,
      maxPlayers: 4,
      aiActionStatus: ""
    };
    this.games.set(gameId, gameState);
    return gameState;
  }
  async getGame(id) {
    return this.games.get(id);
  }
  async getAllGames() {
    return Array.from(this.games.values());
  }
  async updateGame(gameState) {
    this.games.set(gameState.id, gameState);
    return gameState;
  }
  async deleteGame(id) {
    this.games.delete(id);
  }
  async getAllCards() {
    return Array.from(this.cards.values());
  }
  async getCard(id) {
    return this.cards.get(id);
  }
  // 全球排行榜实现
  async uploadToLeaderboard(data) {
    try {
      const [result] = await db.insert(globalLeaderboard).values(data).returning();
      return result;
    } catch (error) {
      console.error("\u4E0A\u4F20\u6392\u884C\u699C\u5931\u8D25:", error);
      throw error;
    }
  }
  async getGlobalLeaderboard() {
    try {
      const results = await db.select().from(globalLeaderboard).orderBy(desc(globalLeaderboard.totalScore)).limit(100);
      return results;
    } catch (error) {
      console.error("\u83B7\u53D6\u6392\u884C\u699C\u5931\u8D25:", error);
      return [];
    }
  }
  async checkDeviceUploaded(deviceId) {
    try {
      const [result] = await db.select().from(globalLeaderboard).where(eq(globalLeaderboard.deviceId, deviceId)).limit(1);
      return !!result;
    } catch (error) {
      console.error("\u68C0\u67E5\u8BBE\u5907\u4E0A\u4F20\u72B6\u6001\u5931\u8D25:", error);
      return false;
    }
  }
  async checkPlayerName(playerName) {
    try {
      const [result] = await db.select().from(globalLeaderboard).where(eq(globalLeaderboard.playerName, playerName)).orderBy(desc(globalLeaderboard.totalScore)).limit(1);
      return result || null;
    } catch (error) {
      console.error("\u68C0\u67E5\u73A9\u5BB6\u540D\u79F0\u5931\u8D25:", error);
      return null;
    }
  }
  async updateLeaderboard(playerName, data) {
    try {
      const [result] = await db.update(globalLeaderboard).set(data).where(eq(globalLeaderboard.playerName, playerName)).returning();
      return result;
    } catch (error) {
      console.error("\u66F4\u65B0\u6392\u884C\u699C\u5931\u8D25:", error);
      throw error;
    }
  }
  getAvailableAIName(game) {
    const usedNames = game.players.map((p) => p.name);
    const availableNames = this.AI_NAMES.filter((name) => !usedNames.includes(name));
    return availableNames[Math.floor(Math.random() * availableNames.length)] || "AI\u73A9\u5BB6";
  }
  shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }
};

// server/storage.ts
var MemStorage = class {
  // 缓存所有卡牌ID
  constructor() {
    this.AI_NAMES = ["\u963F\u8C6A", "\u8001\u5B8B", "\u963F\u5B97", "\u5C0F\u674E", "\u5C0F\u738B", "\u5C0F\u5F20", "\u5C0F\u9648", "\u8001\u5218"];
    this.cardIds = [];
    this.users = /* @__PURE__ */ new Map();
    this.games = /* @__PURE__ */ new Map();
    this.cards = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentGameId = 1;
    this.cardIds = [];
    this.initializeCards();
  }
  initializeCards() {
    hexagramsData.forEach((hexagram) => {
      this.cards.set(hexagram.id, hexagram);
      this.cardIds.push(hexagram.id);
    });
  }
  // 优化：获取所有卡牌ID的快速方法
  getAllCardIds() {
    return [...this.cardIds];
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }
  async createUser(insertUser) {
    let id = Date.now() + Math.floor(Math.random() * 1e5);
    while (this.users.has(id)) {
      id = Date.now() + Math.floor(Math.random() * 1e5) + Math.floor(Math.random() * 1e3);
    }
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Game methods
  async createGame(hostId, mode = "single", playerName = "\u73A9\u5BB6") {
    const id = this.currentGameId++;
    const aiNames = ["\u963F\u8C6A", "\u8001\u5B8B", "\u963F\u5B97"];
    const players = [
      {
        id: 0,
        // 玩家使用游戏内序号0
        name: playerName,
        cards: [],
        score: 150,
        isAI: false,
        userId: hostId
        // 正确设置userId用于身份验证
      }
    ];
    for (let i = 0; i < 3; i++) {
      players.push({
        id: i + 1,
        // AI玩家使用游戏内序号1, 2, 3
        name: aiNames[i],
        cards: [],
        score: 150,
        isAI: true
        // AI玩家不需要userId，因为它们不进行身份验证
      });
    }
    const deck = Array.from(this.cards.keys());
    this.shuffleDeck(deck);
    players.forEach((player) => {
      for (let i = 0; i < 5; i++) {
        const card = deck.pop();
        if (card) {
          player.cards.push(card);
        }
      }
    });
    const currentCard = deck.pop() || null;
    const gameState = {
      id,
      hostId,
      status: "playing",
      // Start game immediately with AI players
      mode: "single",
      // Only support single player mode
      currentPlayer: 0,
      direction: "clockwise",
      players,
      // Include all players (host + 3 AI) from start
      deck,
      discardPile: currentCard ? [currentCard] : [],
      currentCard,
      scores: players.reduce((acc, player) => {
        acc[player.id] = player.score;
        return acc;
      }, {}),
      round: 1,
      maxPlayers: 4
    };
    this.games.set(id, gameState);
    return gameState;
  }
  async getGame(id) {
    return this.games.get(id);
  }
  async getAllGames() {
    return Array.from(this.games.values());
  }
  async updateGame(gameState) {
    this.games.set(gameState.id, gameState);
    return gameState;
  }
  // Simple cleanup for single player games
  async cleanGameData(gameId) {
    const game = this.games.get(gameId);
    if (!game) return;
    game.players.forEach((player) => {
      player.score = 150;
      game.scores[player.id] = 150;
    });
    game.round = 1;
    game.discardPile = [];
    game.aiActionStatus = void 0;
    await this.updateGame(game);
  }
  async deleteGame(id) {
    this.games.delete(id);
  }
  // Get available AI names that don't conflict with existing players
  getAvailableAIName(game) {
    const existingNames = game.players.map((p) => p.name);
    for (const name of this.AI_NAMES) {
      if (!existingNames.includes(name)) {
        return name;
      }
    }
    let counter = 1;
    while (existingNames.includes(`AI${counter}`)) {
      counter++;
    }
    return `AI${counter}`;
  }
  async getAllCards() {
    return Array.from(this.cards.values());
  }
  async getCard(id) {
    return this.cards.get(id);
  }
  // 全球排行榜 - 在内存存储中暂时不实现
  async uploadToLeaderboard(data) {
    throw new Error("\u5168\u7403\u6392\u884C\u699C\u529F\u80FD\u9700\u8981\u6570\u636E\u5E93\u652F\u6301");
  }
  async getGlobalLeaderboard() {
    return [];
  }
  async checkDeviceUploaded(deviceId) {
    return false;
  }
  shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }
};
var HybridStorage = class {
  constructor() {
    this.memStorage = new MemStorage();
    this.dbStorage = new DatabaseStorage();
  }
  async getUser(id) {
    return this.memStorage.getUser(id);
  }
  async getUserByUsername(username) {
    return this.memStorage.getUserByUsername(username);
  }
  async createUser(user) {
    return this.memStorage.createUser(user);
  }
  async createGame(hostId, mode, playerName) {
    return this.memStorage.createGame(hostId, mode, playerName);
  }
  async getGame(id) {
    return this.memStorage.getGame(id);
  }
  async getAllGames() {
    return this.memStorage.getAllGames();
  }
  async updateGame(gameState) {
    return this.memStorage.updateGame(gameState);
  }
  async deleteGame(id) {
    return this.memStorage.deleteGame(id);
  }
  async getAllCards() {
    return this.memStorage.getAllCards();
  }
  async getCard(id) {
    return this.memStorage.getCard(id);
  }
  // Use database storage for global leaderboard
  async uploadToLeaderboard(data) {
    return this.dbStorage.uploadToLeaderboard(data);
  }
  async getGlobalLeaderboard() {
    return this.dbStorage.getGlobalLeaderboard();
  }
  async checkDeviceUploaded(deviceId) {
    return this.dbStorage.checkDeviceUploaded(deviceId);
  }
  async checkPlayerName(playerName) {
    return this.dbStorage.checkPlayerName(playerName);
  }
  async updateLeaderboard(playerName, data) {
    return this.dbStorage.updateLeaderboard(playerName, data);
  }
};
var storage = new HybridStorage();

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server2) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server: server2 },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import compression from "compression";

// server/routes/leaderboard.ts
async function uploadLeaderboard(req, res) {
  try {
    console.log("\u6536\u5230\u6392\u884C\u699C\u6570\u636E:", req.body);
    const requestData = { ...req.body };
    if (requestData.lastPlayed) {
      if (typeof requestData.lastPlayed === "number") {
        requestData.lastPlayed = new Date(requestData.lastPlayed);
      } else if (typeof requestData.lastPlayed === "string") {
        requestData.lastPlayed = new Date(parseInt(requestData.lastPlayed));
      }
    }
    console.log("\u8F6C\u6362\u540E\u7684\u6570\u636E:", requestData);
    const data = insertGlobalLeaderboardSchema.parse(requestData);
    const result = await storage.uploadToLeaderboard(data);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("\u4E0A\u4F20\u6392\u884C\u699C\u5931\u8D25:", error);
    res.status(500).json({ error: "\u4E0A\u4F20\u5931\u8D25", details: error.message });
  }
}
async function getLeaderboard(req, res) {
  try {
    const leaderboard = await storage.getGlobalLeaderboard();
    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error("\u83B7\u53D6\u6392\u884C\u699C\u5931\u8D25:", error);
    res.status(500).json({ error: "\u83B7\u53D6\u5931\u8D25" });
  }
}
async function checkDeviceUploaded(req, res) {
  try {
    const { deviceId } = req.params;
    const uploaded = await storage.checkDeviceUploaded(deviceId);
    res.json({ uploaded });
  } catch (error) {
    console.error("\u68C0\u67E5\u8BBE\u5907\u4E0A\u4F20\u72B6\u6001\u5931\u8D25:", error);
    res.status(500).json({ error: "\u68C0\u67E5\u5931\u8D25" });
  }
}
async function checkPlayerName(req, res) {
  try {
    const { playerName } = req.params;
    const existingPlayer = await storage.checkPlayerName(playerName);
    res.json({
      exists: !!existingPlayer,
      playerData: existingPlayer
    });
  } catch (error) {
    console.error("\u68C0\u67E5\u73A9\u5BB6\u540D\u79F0\u5931\u8D25:", error);
    res.status(500).json({ error: "\u68C0\u67E5\u5931\u8D25" });
  }
}
async function updateLeaderboard(req, res) {
  try {
    const { playerName } = req.params;
    const updateData = req.body;
    const requestData = { ...updateData };
    if (requestData.lastPlayed) {
      if (typeof requestData.lastPlayed === "number") {
        requestData.lastPlayed = new Date(requestData.lastPlayed);
      } else if (typeof requestData.lastPlayed === "string") {
        requestData.lastPlayed = new Date(parseInt(requestData.lastPlayed));
      }
    }
    const data = insertGlobalLeaderboardSchema.parse(requestData);
    const result = await storage.updateLeaderboard(playerName, data);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("\u66F4\u65B0\u6392\u884C\u699C\u5931\u8D25:", error);
    res.status(500).json({ error: "\u66F4\u65B0\u5931\u8D25", details: error.message });
  }
}

// server/index.ts
var app = express2();
var server = createServer(app);
app.use(compression());
app.use(express2.json({ limit: "10mb" }));
app.use(express2.urlencoded({ extended: true, limit: "10mb" }));
app.use((err, req, res, _next) => {
  console.error("Server error:", err);
  if (res.headersSent) {
    return;
  }
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong"
  });
});
app.get("/api/cards", async (req, res) => {
  try {
    const cards = await storage.getAllCards();
    res.json(cards);
  } catch (error) {
    console.error("Error getting cards:", error);
    res.status(500).json({ error: "Failed to get cards" });
  }
});
app.get("/api/cards/:id", async (req, res) => {
  try {
    const card = await storage.getCard(req.params.id);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.json(card);
  } catch (error) {
    console.error("Error getting card:", error);
    res.status(500).json({ error: "Failed to get card" });
  }
});
app.post("/api/leaderboard/upload", uploadLeaderboard);
app.get("/api/leaderboard", getLeaderboard);
app.get("/api/leaderboard/check-device/:deviceId", checkDeviceUploaded);
app.get("/api/leaderboard/check-player/:playerName", checkPlayerName);
app.put("/api/leaderboard/update/:playerName", updateLeaderboard);
var PORT = process.env.PORT || 5e3;
if (process.env.NODE_ENV === "production") {
  serveStatic(app);
} else {
  setupVite(app, server);
}
server.listen(PORT, "0.0.0.0", () => {
  log(`Server running on port ${PORT}`);
});
