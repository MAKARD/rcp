import {Player} from "../../interfaces/player.interface";

export class PlayerSetHandEvent {
    constructor (
        public readonly gameId: string,
        public readonly player: Player
    ) {}
}
