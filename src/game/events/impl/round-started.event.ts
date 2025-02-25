import {Player} from "../../interfaces/player.interface";

export class RoundStartEvent {
    constructor (
        public readonly gameId: string,
        public readonly playersInRound: Array<Player>
    ) {}
}
