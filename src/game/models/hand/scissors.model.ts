import {AbstractHand} from "./abstract-hand";
import {Paper} from "./paper.model";
import {Rock} from "./rock.model";

export class Scissors extends AbstractHand {
    overcomes () {
        return Paper;
    }

    lossesTo () {
        return Rock;
    }
}
