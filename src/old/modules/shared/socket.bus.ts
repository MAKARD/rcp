import {Server} from "http";

import {Server as SocketServer} from "socket.io";

interface Events {
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
    "game/ended": (winnerId?: string) => void;
}

export class SocketBus extends SocketServer<Events, Events, Events> {
    public static sharedInstance: SocketBus;

    public static init (server: Server) {
        SocketBus.sharedInstance = new SocketBus(server);
    }

    private constructor (server: Server) {
        super(server);

        if (SocketBus.sharedInstance) {
            return SocketBus.sharedInstance;
        }

        return this;
    }
}
