import {AbstractHand} from "./abstract-hand";

export class Unset extends AbstractHand {
    overcomes () {
        return () => {};
    }

    lossesTo () {
        return () => {};
    }

    toString () {
        return "no hand";
    }
}
