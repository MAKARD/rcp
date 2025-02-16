import {Hand} from "./Hand";
import {Paper} from "./Paper";
import {Scissors} from "./Scissors";

export class Rock extends Hand {
    overcomes () {
        return Scissors;
    }

    lossesTo () {
        return Paper;
    }
}
