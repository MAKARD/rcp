import {Hand} from "../../interfaces/hand.interface";

export abstract class AbstractHand implements Hand {
    abstract overcomes (): typeof AbstractHand | (() => void);

    abstract lossesTo (): typeof AbstractHand | (() => void);

    public checkAgainst (hand: Hand) {
        if (hand instanceof this.overcomes()) {
            return "win";
        }

        if (hand instanceof this.lossesTo()) {
            return "lose";
        }

        return "draw";
    }

    toString () {
        return this.constructor.name;
    }
}
