import {Player} from "../../interfaces/player.interface";

export class RoundDrawnEvent {
    constructor (
        public readonly gameId: string,
        public readonly playersInRound: Array<Player>
    ) {}
}
