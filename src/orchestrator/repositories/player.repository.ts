import {Injectable} from "@nestjs/common";

import {Player} from "../interfaces/player.interface";

@Injectable()
export class PlayerRepository {
    private players = new Map<string, Player>();

    private sockets = new Map<string, Player>();

    findOneBySocketId (id: string): Player | undefined {
        const player = this.sockets.get(id);

        return player;
    }

    findOneBySocketIdOrFail (id: string): Player {
        const player = this.findOneBySocketId(id);

        if (!player) {
            throw new Error(`Player ${id} not found`);
        }

        return player;
    }

    findOneById (id: string): Player | undefined {
        const player = this.players.get(id);

        return player;
    }

    findOneByIdOrFail (id: string): Player {
        const player = this.findOneById(id);

        if (!player) {
            throw new Error(`Player ${id} not found`);
        }

        return player;
    }

    insertOne (player: Player) {
        this.players.set(player.id, player);
        this.sockets.set(player.socket.id, player);
    }

    deleteOneById (id: string) {
        this.players.delete(id);
    }
}
