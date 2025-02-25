import {Player} from "../../interfaces/player.interface";

export class GameEndedEvent {
    constructor (
        public readonly gameId: string,
        public readonly winner?: Player
    ) {}
}
