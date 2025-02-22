import {Player} from "../../entities/Player";

export class PlayersService {
    public static readonly sharedInstance = new PlayersService();

    private constructor () {
        if (PlayersService.sharedInstance) {
            return PlayersService.sharedInstance;
        }

        this.players = new Map<string, Player>();

        return this;
    }

    private players: Map<string, Player>;

    public getById (id: string) {
        const player = this.players.get(id);

        if (!player) {
            throw new Error("Not found");
        }

        return player;
    }

    public createPlayer (id: string, name: string) {
        const player = new Player(name, id);

        this.players.set(id, player);

        return player;
    }

    public removeById (id: string) {
        this.players.delete(id);
    }
}
