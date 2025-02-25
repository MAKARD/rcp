export class AddPlayerCommand {
    constructor (
        public readonly gameId: string,
        public readonly id: string,
        public readonly name: string
    ) {}
}
