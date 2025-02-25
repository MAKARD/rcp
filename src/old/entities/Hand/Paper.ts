import {Hand} from "./Hand";
import {Rock} from "./Rock";
import {Scissors} from "./Scissors";

export class Paper extends Hand {
    overcomes () {
        return Rock;
    }

    lossesTo () {
        return Scissors;
    }
}
