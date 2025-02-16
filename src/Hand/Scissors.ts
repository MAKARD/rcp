import {Hand} from "./Hand";
import {Paper} from "./Paper";
import {Rock} from "./Rock";

export class Scissors extends Hand {
    overcomes () {
        return Paper;
    }

    lossesTo () {
        return Rock;
    }
}
