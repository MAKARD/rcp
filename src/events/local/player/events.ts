import {PlayerJSON, Player} from "../../../entities/Player";

export interface Events {
    "local/player:left": [PlayerJSON];
    "local/player:joined": [sessionId: string, player: Player];
    "local/player:not-joined": [PlayerJSON];
    "local/player:hand-request": [PlayerJSON];
}
