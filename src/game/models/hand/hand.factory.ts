import {Hand} from "../../interfaces/hand.interface";

import {Paper} from "./paper.model";
import {Rock} from "./rock.model";
import {Scissors} from "./scissors.model";

export class HandFactory {
    private static map = new Set([Paper, Scissors, Rock]);

    static availableHands = [...HandFactory.map.values()];

    static availableHandsNames = HandFactory.availableHands.map(({name}) => name.toLowerCase());

    static createFromString (name: string): Hand {
        const hand = HandFactory.availableHands
            .find((availableHand) => availableHand.name.toLowerCase() === name.toLowerCase());

        if (!hand) {
            throw new Error(`Invalid string ${name} given`);
        }

        return new hand();
    }
}
