import {JsonObject} from "type-fest";

import {Player} from "./player.interface";

export interface Game {
    readonly "id": string;

    start(): void;
    addPlayer (player: Player): void;
    removePlayer(playerId: string): void;
    toJSON(): JsonObject;
}
