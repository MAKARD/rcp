import {Jsonify} from "type-fest";

import {Hand} from "../Hand/Hand";
import {HandFactory} from "../Hand/HandFactory";

import {PlayerEvents} from "./PlayerEvents";

interface PlayerData {
    "name": string;
    "id": string;
}

export type PlayerJSON = Jsonify<PlayerData>;

export class Player implements PlayerData {
    constructor (
        public name: string,
        public id: string
    ) {}

    public eventEmitter = new PlayerEvents();

    private _currentHand?: Hand;

    private _isSpectator = false;

    resetHand () {
        this._currentHand = undefined;
    }

    public set currentHand (nextValue: string) {
        this._currentHand = HandFactory.createFromString(nextValue);

        this.eventEmitter.emit("onSetHand");
    }

    public get currentHand (): Hand {
        return this._currentHand as never;
    }

    public get isSpectator () {
        return this._isSpectator;
    }

    public set isSpectator (nextValue: boolean) {
        if (this._isSpectator === nextValue) {
            return;
        }

        this._isSpectator = nextValue;

        this.eventEmitter.emit("onChangeStatus", nextValue);
    }

    toJSON (): PlayerJSON {
        return {
            "id": this.id,
            "name": this.name
        };
    }
}
