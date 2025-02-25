import {Game, GameEvents} from "../../entities/Game";

export class GamesService {
    public static readonly sharedInstance = new GamesService();

    private constructor () {
        if (GamesService.sharedInstance) {
            return GamesService.sharedInstance;
        }

        this.games = new Map<string, Game>();

        return this;
    }

    private games: Map<string, Game>;

    public getById (id: string) {
        const session = this.games.get(id);

        if (!session) {
            throw new Error("Not found");
        }

        return session;
    }

    public create (id: string, gameEvents: GameEvents) {
        const game = new Game([], gameEvents);

        this.games.set(id, game);

        return game;
    }

    public removeById (id: string) {
        this.games.delete(id);
    }
}
