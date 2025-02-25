import {AggregateRoot} from "@nestjs/cqrs";
import {BehaviorSubject} from "rxjs";
import {skip} from "rxjs/operators";

import {GameCreatedEvent} from "../events/impl/game-created.event";
import {PlayerAddedEvent} from "../events/impl/player-added.event";
import {GameStartAllowedEvent} from "../events/impl/game-start-allowed.event";
import {GameStartDeniedEvent} from "../events/impl/game-start-denied.event";
import {Game} from "../interfaces/game.interface";
import {Player} from "../interfaces/player.interface";
import {PlayerRemovedEvent} from "../events/impl/player-removed.event";

export class GameModel extends AggregateRoot implements Game {
    private players = new BehaviorSubject<Array<Player>>([]);

    private isSufficientPlayers = new BehaviorSubject(false);

    public abortController?: AbortController;

    constructor (
        public readonly id: string
    ) {
        super();

        this.autoCommit = true;
        this.apply(new GameCreatedEvent(id));

        this.players.pipe(skip(1)).subscribe((playersArray) => {
            this.isSufficientPlayers.next(
                playersArray.filter((player) => !player.isSpectator.getValue()).length > 1
            );
        });

        this.isSufficientPlayers.subscribe((isSufficientPlayers) => {
            if (isSufficientPlayers) {
                this.apply(new GameStartAllowedEvent(this.id));
            } else {
                this.apply(new GameStartDeniedEvent(this.id));
            }
        });

    }

    prepareToStart () {
        this.abortController = new AbortController();

        this.abortController.signal.addEventListener("abort", () => {
            this.abortController = undefined;

            this.players.next([...this.players.getValue()]);
        });
    }

    addPlayer (player: Player) {
        const foundPlayerIndex = this.players
            .getValue()
            .findIndex((existingPlayer) => existingPlayer.id === player.id);

        player.isSpectator.subscribe(() => {
            this.players.next([...this.players.getValue()]);
        });

        if (foundPlayerIndex !== -1) {
            throw new Error("Existing");
        }

        this.apply(new PlayerAddedEvent(player));

        this.players.next(this.players.getValue().concat([player]));
    }

    removePlayer (playerToRemove: Player) {
        this.apply(new PlayerRemovedEvent(this.id, playerToRemove));

        this.players.next(
            this.players.getValue().filter((player) => player.id !== playerToRemove.id)
        );
    }

    getPlayers (): Array<Player> {
        return this.players.getValue();
    }
}
