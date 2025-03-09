import {Hand} from "./abstract-hand";
import {Paper} from "./paper";
import {Rock} from "./rock";
import {Scissors} from "./scissors";

export class HandFactory {
    private static map = new Set([Paper, Scissors, Rock]);

    private static availableHands = [...HandFactory.map.values()];

    static createFromString (name: string): Hand {
        const hand = HandFactory.availableHands
            .find((availableHand) => availableHand.name.toLowerCase() === name.toLowerCase());

        if (!hand) {
            throw new Error(`Invalid string ${name} given`);
        }

        return new hand();
    }
}
