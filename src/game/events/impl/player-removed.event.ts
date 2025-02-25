import {Player} from "../../interfaces/player.interface";

export class PlayerRemovedEvent {
    constructor (
        public readonly gameId: string,
        public readonly player: Player
    ) {}
}
