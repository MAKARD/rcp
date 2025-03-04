import {AggregateRoot} from "@nestjs/cqrs";

import {Player} from "../interfaces/player.interface";
import {Hand} from "../interfaces/hand.interface";
import {StateSubject} from "../../common/observables/StateSubject";

import {Unset} from "./hand/unset.model";
import {HandFactory} from "./hand/hand.factory";

export class PlayerModel extends AggregateRoot implements Player {
    constructor (
        public readonly id: string,
        public readonly name: string
    ) {
        super();

        this.autoCommit = true;
    }

    public isSpectator = new StateSubject(false);

    public currentHand = new StateSubject<Hand>(new Unset());

    public gameId = new StateSubject<string | undefined>(undefined);

    public resetHand () {
        this.currentHand.next(new Unset());
    }

    public setHandFromString (hand: string) {
        this.currentHand.next(HandFactory.createFromString(hand));
    }

    toJSON () {
        return {
            "id": this.id,
            "name": this.name,
            "gameId": this.gameId.getValue() || ""
        };
    }
}
