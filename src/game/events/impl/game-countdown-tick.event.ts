export class GameCountdownTickEvent {
    constructor (
        public readonly gameId: string,
        public readonly timeLeft: number
    ) {}
}
