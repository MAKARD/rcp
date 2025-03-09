import {AbstractHand} from "./abstract-hand";
import {Paper} from "./paper";
import {Rock} from "./rock";

export class Scissors extends AbstractHand {
    overcomes () {
        return Paper;
    }

    lossesTo () {
        return Rock;
    }
}
