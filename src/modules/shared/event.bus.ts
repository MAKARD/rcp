import {EventEmitter} from "node:events";

interface Events {
    "game/start:denied": [gameId: string];
    "game/start:allowed": [gameId: string];
    "game/countdown:tick": [gameId: string, timeLeft: number];
    "game/round:started": [gameId: string, playersIdInRound: Array<string>];
    "game/round:drawn": [gameId: string, playersIdInRound: Array<string>];
    "game/ended": [gameId: string, winnerId?: string];

    "player/joined": [gameId: string, playerId: string];
    "player/left": [gameId: string, playerId: string];
    "player/not-joined": [connectionId: string, playerName: string];
}

export class EventBus extends EventEmitter<Events> {
    public static readonly sharedInstance = new EventBus();

    private constructor () {
        super();

        if (EventBus.sharedInstance) {
            return EventBus.sharedInstance;
        }

        return this;
    }
}
