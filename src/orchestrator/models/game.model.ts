import {AggregateRoot} from "@nestjs/cqrs";
import {JsonObject} from "type-fest";

import {Game} from "../../core/game";
import {Game as IGame} from "../interfaces/game.interface";
import {Player, PlayerJSONData} from "../interfaces/player.interface";
import {GameStartAllowedEvent} from "../events/game-start-allowed.event";
import {GameStartDeniedEvent} from "../events/game-start-denied.event";
import {GameEndedEvent} from "../events/game-ended.event";
import {RoundDrawnEvent} from "../events/round-drawn.event";
import {RoundStartEvent} from "../events/round-started.event";

export class GameModel extends AggregateRoot implements IGame {
    private game: Game;

    constructor (
        public readonly id: string,
        onRequestPlayersHands: (playersIds: Array<PlayerJSONData>) => void
    ) {
        super();

        this.autoCommit = true;

        this.game = new Game(this.id, {
            "onGameAllowedToStart": () => {
                this.apply(new GameStartAllowedEvent(this.id));
            },
            "onGameDeniedToStart": () => {
                this.apply(new GameStartDeniedEvent(this.id));
            },
            "onGameEnded": (winner) => {
                this.apply(new GameEndedEvent(this.id, winner?.toJSON()));
            },
            "onRequestPlayersHands": (players) => {
                onRequestPlayersHands(players.map((player) => player.toJSON()));
            },
            "onRoundDrawn": (players) => {
                this.apply(new RoundDrawnEvent(this.id, players.map((player) => player.toJSON())));
            },
            "onRoundStart": (players) => {
                this.apply(new RoundStartEvent(this.id, players.map((player) => player.toJSON())));
            }
        });
    }

    public addPlayer (player: Player): void {
        return this.game.addPlayer(player.getCorePlayerInstance());
    }

    public removePlayer (playerId: string) {
        return this.game.removePlayer(playerId);
    }

    public toJSON (): JsonObject {
        return this.game.toJSON();
    }

    public start (): void {
        this.game.start();
    }
}
