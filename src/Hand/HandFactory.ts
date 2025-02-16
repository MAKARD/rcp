import {Hand} from "./Hand";
import {Paper} from "./Paper";
import {Rock} from "./Rock";
import {Scissors} from "./Scissors";

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
