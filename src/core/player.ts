import {Hand} from "./hand/abstract-hand";
import {HandFactory} from "./hand/hand.factory";
import {Unset} from "./hand/unset";
import {StateSubject} from "./observables/StateSubject";

export class Player {
    public currentHand = new StateSubject<Hand>(new Unset());

    public gameId = new StateSubject<string | undefined>(undefined);

    public isSpectator = false;

    constructor (
        public readonly id: string,
        public readonly name: string
    ) {}

    public resetHand () {
        this.currentHand.next(new Unset());
    }

    public setHandFromString (hand: string) {
        this.currentHand.next(HandFactory.createFromString(hand));
    }

    toJSON () {
        return {
            "currentHand": this.currentHand.getValue().toString(),
            "gameId": this.gameId.getValue() || "",
            "id": this.id,
            "isSpectator": this.isSpectator,
            "name": this.name
        };
    }
}
