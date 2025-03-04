import {Player} from "../../interfaces/player.interface";

export class PlayerInvalidHandEvent {
    constructor (
        public readonly gameId: string,
        public readonly player: Player,
        public readonly error: Error
    ) {}
}
