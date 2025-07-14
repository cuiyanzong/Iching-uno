import express from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { setupVite, serveStatic } from "./vite";
import { log } from "./vite";
import compression from "compression";
import type { Request, Response, NextFunction } from "express";
import { uploadLeaderboard, getLeaderboard, checkDeviceUploaded, checkPlayerName, updateLeaderboard } from "./routes/leaderboard";

const app = express();
const server = createServer(app);

// Middleware
app.use(compression()); // Enable gzip compression
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Error handling middleware
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  
  // Check if headers are already sent
  if (res.headersSent) {
    return;
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong"
  });
});

// Basic API routes for single player games
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

// 全球排行榜 API
app.post("/api/leaderboard/upload", uploadLeaderboard);
app.get("/api/leaderboard", getLeaderboard);
app.get("/api/leaderboard/check-device/:deviceId", checkDeviceUploaded);
app.get("/api/leaderboard/check-player/:playerName", checkPlayerName);
app.put("/api/leaderboard/update/:playerName", updateLeaderboard);

// Start server
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  serveStatic(app);
} else {
  setupVite(app, server);
}

server.listen(PORT, "0.0.0.0", () => {
  log(`Server running on port ${PORT}`);
});