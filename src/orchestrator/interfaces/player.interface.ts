import {Socket} from "socket.io";

import {Player as PlayerCore} from "../../core/player";

export interface PlayerJSONData {
    readonly "id": string;
    readonly "name": string;
    readonly "currentHand": string;
    readonly "isSpectator": boolean;
}

export interface Player extends PlayerJSONData {
    readonly "socket": Socket;

    setHandFromString(hand: string): void;

    toJSON(): PlayerJSONData;

    getCorePlayerInstance(): PlayerCore;
}
