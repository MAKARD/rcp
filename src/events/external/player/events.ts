import {PlayerJSON} from "../../../entities/Player";

export interface Events {
    "network/player:join": (sessionId: string, playerData: PlayerJSON) => void;
    "network/player:joined": (player: PlayerJSON) => void;
    "network/player:left": (player: PlayerJSON) => void;
    "network/player:not-joined": () => void;
    "network/player:hand-request": (callback: (response: string) => void) => void;
    "network/player:invalid-hand": () => void;
    "network/player:moved-to-spectators": (player: PlayerJSON) => void;
    "network/player:move-to-players": (sessionId: string) => void;
}
