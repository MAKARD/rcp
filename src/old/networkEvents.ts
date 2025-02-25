export interface NetworkEvents {
    "player/hand:request": (callback: ((hand: string) => void)) => void;
    "player/join": (sessionId: string, playerName: string) => void;
    "player/status:move-to-players": (sessionId: string) => void;

    "player/joined": (playerName: string) => void;
    "player/left": (playerName: string) => void;
    "player/not-joined": (playerName: string) => void;
    "player/status:moved-to-spectators": (playerId: string, playerName: string) => void;

    "game/start:denied": () => void;
    "game/countdown:tick": (timeLeft: number) => void;
    "game/round:started": (playersIdInRound: Array<string>) => void;
    "game/round:drawn": (playersIdInRound: Array<string>) => void;
    "game/ended": (winnerName?: string) => void;
}
