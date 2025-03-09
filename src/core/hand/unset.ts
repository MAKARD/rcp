import {AbstractHand} from "./abstract-hand";

export class Unset extends AbstractHand {
    overcomes () {
        return function () {};
    }

    lossesTo () {
        return function () {};
    }

    toString () {
        return "no hand";
    }
}
