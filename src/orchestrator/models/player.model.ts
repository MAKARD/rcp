import {Socket} from "socket.io";

import {Player} from "../../core/player";
import {Player as IPlayer} from "../interfaces/player.interface";

export class PlayerModel implements IPlayer {
    private player: Player;

    constructor (
        id: string,
        name: string,
        public readonly socket: Socket
    ) {
        this.player = new Player(id, name);
    }

    public get id () {
        return this.player.id;
    }

    public get name () {
        return this.player.name;
    }

    public get currentHand () {
        return this.player.currentHand.getValue().toString();
    }

    public get isSpectator () {
        return this.player.isSpectator;
    }

    public getCorePlayerInstance () {
        return this.player;
    }

    setHandFromString (hand: string): void {
        return this.player.setHandFromString(hand);
    }

    toJSON () {
        return this.player.toJSON();
    }
}
