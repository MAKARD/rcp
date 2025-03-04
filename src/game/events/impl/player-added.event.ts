import {Player} from "../../interfaces/player.interface";

export class PlayerAddedEvent {
    constructor (
        public readonly gameId: string,
        public readonly player: Player
    ) {}
}
