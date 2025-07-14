import type { GameState, Player } from "@shared/schema";

// Filter game state for a specific player (hide other players' cards)
export function filterGameStateForPlayer(gameState: GameState, playerId: number): GameState {
  if (gameState.mode === "single") {
    // In single player mode, show all cards as before
    return gameState;
  }

  // In multiplayer mode, hide other players' cards
  const filteredPlayers = gameState.players.map((player: Player) => {
    // Match by both id and userId to handle different player creation scenarios
    const isCurrentPlayer = player.id === playerId || player.userId === playerId;
    
    if (isCurrentPlayer) {
      return player;
    } else {
      // For waiting games, show empty cards to avoid confusion
      if (gameState.status === "waiting") {
        return {
          ...player,
          cards: [] // Empty cards for waiting players
        };
      }
      
      return {
        ...player,
        cards: new Array(player.cards.length).fill("")
      };
    }
  });

  return {
    ...gameState,
    players: filteredPlayers
  };
}

// Check if a player can perform an action (play/draw)
export function canPlayerAct(gameState: GameState, playerId: number): boolean {
  const currentPlayer = gameState.players[gameState.currentPlayer];
  if (!currentPlayer) return false;
  
  // Player can only act if it's their turn - 使用userId进行身份验证
  return (currentPlayer.id === playerId || currentPlayer.userId === playerId) && !currentPlayer.isAI;
}