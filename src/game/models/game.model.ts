import {AggregateRoot} from "@nestjs/cqrs";
import {Subject} from "rxjs";

import {GameCreatedEvent} from "../events/impl/game-created.event";
import {PlayerAddedEvent} from "../events/impl/player-added.event";
import {GameStartAllowedEvent} from "../events/impl/game-start-allowed.event";
import {GameStartDeniedEvent} from "../events/impl/game-start-denied.event";
import {Game} from "../interfaces/game.interface";
import {Player} from "../interfaces/player.interface";
import {PlayerRemovedEvent} from "../events/impl/player-removed.event";
import {StateSubject} from "../../common/observables/StateSubject";

export class GameModel extends AggregateRoot implements Game {
    private players = new StateSubject<Array<Player>>([]);

    private isSufficientPlayers = new Subject<boolean>();

    public abortController?: AbortController;

    public isRunning = new StateSubject(false);

    constructor (
        public readonly id: string
    ) {
        super();

        this.autoCommit = true;
        this.apply(new GameCreatedEvent(id));

        this.players.subscribe((playersArray) => {
            this.isSufficientPlayers.next(
                playersArray.filter((player) => !player.isSpectator.getValue()).length > 1
            );
        });

        this.isSufficientPlayers.subscribe((isSufficientPlayers) => {
            if (isSufficientPlayers) {
                if (this.isRunning.getValue()) {
                    return;
                }

                this.apply(new GameStartAllowedEvent(this.id));
            } else {
                this.apply(new GameStartDeniedEvent(this.id));
            }
        });

        this.isRunning.subscribe((isRunning) => {
            if (isRunning) {
                return;
            }

            this.players.next([...this.players.getValue()]);
        });
    }

    prepareToStart () {
        this.players.getValue().forEach((player) => {
            player.resetHand();
        });

        this.abortController = new AbortController();

        this.isRunning.next(true);

        this.abortController.signal.addEventListener("abort", () => {
            this.abortController = undefined;

            this.isRunning.next(false);
        });
    }

    addPlayer (player: Player) {
        const foundPlayerIndex = this.players
            .getValue()
            .findIndex((existingPlayer) => existingPlayer.id === player.id);

        if (foundPlayerIndex !== -1) {
            throw new Error(`Player ${player.id} is already added`);
        }

        if (this.isRunning.getValue()) {
            player.isSpectator.next(true);
        }

        this.apply(new PlayerAddedEvent(this.id, player));

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
