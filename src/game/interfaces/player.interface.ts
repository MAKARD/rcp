import {JsonObject} from "type-fest";

import {StateSubject} from "../../common/observables/StateSubject";

import {Hand} from "./hand.interface";

export interface Player {
    readonly "id": string;
    readonly "name": string;
    readonly "gameId": StateSubject<string | undefined>;
    readonly "isSpectator": StateSubject<boolean>;
    readonly "currentHand": StateSubject<Hand>;

    resetHand(): void;
    setHandFromString(hand: string): void;

    toJSON(): JsonObject;
}
