import {AbstractHand} from "./abstract-hand";
import {Paper} from "./paper";
import {Scissors} from "./scissors";

export class Rock extends AbstractHand {
    overcomes () {
        return Scissors;
    }

    lossesTo () {
        return Paper;
    }
}
