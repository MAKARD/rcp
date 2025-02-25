import {Player} from "../../interfaces/player.interface";

export class PlayerSetHandEvent {
    constructor (
        public readonly player: Player
    ) {}
}
