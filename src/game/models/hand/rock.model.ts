import {AbstractHand} from "./abstract-hand";
import {Paper} from "./paper.model";
import {Scissors} from "./scissors.model";

export class Rock extends AbstractHand {
    overcomes () {
        return Scissors;
    }

    lossesTo () {
        return Paper;
    }
}
