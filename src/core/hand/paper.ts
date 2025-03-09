import {AbstractHand} from "./abstract-hand";
import {Rock} from "./rock";
import {Scissors} from "./scissors";

export class Paper extends AbstractHand {
    overcomes () {
        return Rock;
    }

    lossesTo () {
        return Scissors;
    }
}
