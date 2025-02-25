interface Commands {
    "game/create": [gameId: string];
    "game/players:hand:request": [gameId: string];

    "player/join": [gameId: string, connectionId: string, playerName: string];
    "player/status:move-to-players": [gameId: string, playerId: string];
    "player/status:move-to-spectators": [gameId: string, playerId: string];
    "player/hand:set": [gameId: string, playerId: string, hand: string];
}

export class CommandBus {
    public static readonly sharedInstance = new CommandBus();

    constructor () {
        if (CommandBus.sharedInstance) {
            return CommandBus.sharedInstance;
        }

        return this;
    }

    private registry = new Map<keyof Commands, (...args: Array<unknown>) => void>();

    bind<T extends keyof Commands>(command: T, executable: (...args: Commands[T]) => void) {
        this.registry.set(command, executable);
    }

    execute<T extends keyof Commands>(command: T, ...args: Commands[T]) {
        const executable = this.registry.get(command);

        if (!executable) {
            throw new Error(`${command} is not bound`);
        }

        executable(...args);
    }

}
