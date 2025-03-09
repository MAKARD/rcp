import {Subscription} from "rxjs";
import {JsonObject} from "type-fest";

import {Player} from "./player";
import {StateSubject} from "./observables/StateSubject";

interface GameEvents {
    onGameAllowedToStart(): void;
    onGameDeniedToStart(): void;
    onGameEnded(winner?: Player): void;
    onRoundDrawn(players: Array<Player>): void;
    onRoundStart(players: Array<Player>): void;
    onRequestPlayersHands(players: Array<Player>): void;
}

export class Game {
    private players = new StateSubject<Array<Player>>([]);

    private abortController?: AbortController;

    private get isRunning () {
        return !!this.abortController && !this.abortController.signal.aborted;
    }

    constructor (
        public readonly id: string,
        private readonly events: GameEvents
    ) {
        this.players.subscribe((players) => {
            const isSufficientPlayers = players.filter((player) => !player.isSpectator).length > 1;

            if (isSufficientPlayers) {
                if (this.isRunning) {
                    return;
                }

                this.events.onGameAllowedToStart();
            } else {
                if (this.isRunning) {
                    this.abortController?.abort();

                    return;
                }

                this.events.onGameDeniedToStart();
            }
        });
    }

    public addPlayer (player: Player) {
        if (
            this.players.getValue().find((existingPlayer) => existingPlayer.id === player.id)
        ) {
            throw new Error(`Player ${player.id} is already added`);
        }

        player.isSpectator = this.isRunning;

        player.gameId.next(this.id);

        this.players.next(
            [...this.players.getValue(), player]
        );
    }

    public removePlayer (playerId: string) {
        const player = this.players.getValue().find((existingPlayer) => existingPlayer.id === playerId);

        if (!player) {
            throw new Error(`Player ${playerId} not found`);
        }

        player.gameId.next(undefined);

        this.players.next(
            this.players.getValue().filter((currentPlayer) => currentPlayer.id !== playerId)
        );
    }

    public async start () {
        this.players.getValue().forEach((player) => {
            player.resetHand();
        });

        this.abortController = new AbortController();

        this.abortController.signal.addEventListener("abort", () => {
            this.abortController = undefined;

            this.players.next(
                this.players.getValue().map((player) => {
                    player.isSpectator = false;

                    return player;
                })
            );
        });

        let playersInRound = this.players.getValue();

        while (this.isRunning) {
            this.events.onRoundStart(playersInRound);

            const winners = await this.playRound(playersInRound);

            if (winners.length === 1) {
                this.events.onGameEnded(winners[0]);

                this.abortController?.abort();

                return;
            }

            if (!winners.length || winners.length === playersInRound.length) {
                this.events.onRoundDrawn(playersInRound);

                continue;
            }

            playersInRound = winners;
        }
    }

    public toJSON (): JsonObject {
        return {
            "id": this.id,
            "players": this.players.getValue()
                .filter((player) => !player.isSpectator)
                .map((player) => player.toJSON()),
            "spectators": this.players.getValue()
                .filter((player) => player.isSpectator)
                .map((player) => player.toJSON())
        };
    }

    private async playRound (playersInRound: Array<Player>) {
        this.events.onRequestPlayersHands(playersInRound);

        const subscriptions = new Subscription();

        await Promise.race([
            Promise.all(playersInRound.map((player) => new Promise<unknown>((resolve) => {
                // Player selected hand
                subscriptions.add(player.currentHand.subscribe(resolve));
                // Player changed(left) the game
                subscriptions.add(player.gameId.subscribe(resolve));
            }))),
            new Promise<unknown>((resolve) => this.abortController?.signal.addEventListener("abort", resolve))
        ]).finally(() => {
            subscriptions.unsubscribe();
        });

        const playersSet = new Set(playersInRound.filter((player) => player.gameId.getValue()));

        [...playersSet.values()].forEach((playerA, _, players) => {
            players.forEach((playerB) => {
                if (playerA === playerB) {
                    return;
                }

                switch (playerA.currentHand.getValue().checkAgainst(playerB.currentHand.getValue())) {
                    case "win": {
                        playersSet.delete(playerB);

                        break;
                    }

                    case "lose": {
                        playersSet.delete(playerA);
                    }
                }
            });
        });

        return [...playersSet.values()];
    }
}
