import {Injectable} from "@nestjs/common";

import {Player} from "../interfaces/player.interface";

@Injectable()
export class PlayerRepository {
    private players = new Map<string, Player>();

    findOneById (id: string): Player | undefined {
        const player = this.players.get(id);

        return player;
    }

    findOneByIdOrFail (id: string): Player {
        const player = this.players.get(id);

        if (!player) {
            throw new Error("Not found");
        }

        return player;
    }

    insertOne (player: Player) {
        this.players.set(player.id, player);
    }

    deleteOneById (id: string) {
        this.players.delete(id);
    }
}
