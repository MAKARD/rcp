export class RemovePlayerCommand {
    constructor (
        public readonly playerId: string,
        public readonly gameId: string
    ) {}
}
