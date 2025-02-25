import {AbstractHand} from "./abstract-hand";
import {Rock} from "./rock.model";
import {Scissors} from "./scissors.model";

export class Paper extends AbstractHand {
    overcomes () {
        return Rock;
    }

    lossesTo () {
        return Scissors;
    }
}
