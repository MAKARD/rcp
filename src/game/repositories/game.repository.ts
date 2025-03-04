import {Injectable} from "@nestjs/common";

import {Game} from "../interfaces/game.interface";

@Injectable()
export class GameRepository {
    private games = new Map<string, Game>();

    findOneById (id: string): Game | undefined {
        const game = this.games.get(id);

        return game;
    }

    findOneByIdOrFail (id: string): Game {
        const game = this.games.get(id);

        if (!game) {
            throw new Error(`Game ${id} is not found`);
        }

        return game;
    }

    insertOne (game: Game) {
        this.games.set(game.id, game);
    }

    deleteOneById (id: string) {
        this.games.delete(id);
    }
}
