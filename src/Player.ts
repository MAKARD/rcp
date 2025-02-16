import {Hand} from "./Hand/Hand";

export class Player {
    constructor (
        public name: string
    ) {}

    public currentHand?: Hand | undefined;

    setHand (hand: Hand) {
        this.currentHand = hand;
    }

    resetHand () {
        this.currentHand = undefined;
    }
}
