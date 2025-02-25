import {PlayerJSON} from "../../../entities/Player";

export interface Events {
    "local/game:waiting": [sessionId: string];
    "local/game:request-to-start": [sessionId: string];
    "local/game:ended": [winner?: PlayerJSON];
    "local/game:round:started": [playersInRound: Array<PlayerJSON>];
    "local/game:round:draw": [playersInRound: Array<PlayerJSON>];
    "local/game:countdown": [sessionId: string, timeLeft: number];
}
