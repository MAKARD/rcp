import {Player} from "../../interfaces/player.interface";

export class PlayerAddedEvent {
    constructor (
        public readonly player: Player
    ) {}
}
