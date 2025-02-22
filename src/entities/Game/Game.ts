import {Player} from "../Player";

import {RunningController} from "./RunningController";
import {GameEvents} from "./GameEvents";

export class Game {
    constructor (
        public players: Array<Player>,
        private eventEmitter: GameEvents
    ) {
        this.runningController = new RunningController(this.players);

        this.runningController.eventEmitter.addListener("onStatusChange", (status) => {
            this.eventEmitter.emit("onAllowanceToStartStatusChange", status);
        });
    }

    private runningController: RunningController;

    private playersInRound: Array<Player> = [];

    public registerPlayer (player: Player) {
        const foundPlayerIndex = this.players.findIndex((existingPlayer) => existingPlayer.id === player.id);

        player.eventEmitter.addListener("onChangeStatus", () => {
            this.runningController.notifyChange(this.players);

            this.playersInRound = this.playersInRound.filter((playerInRound) => player.id !== playerInRound.id);
        });

        if (foundPlayerIndex !== -1) {
            this.players[foundPlayerIndex] = player;
            this.runningController.notifyChange(this.players);

            player.eventEmitter.emit("onRegistered");

            return;
        }

        this.players.push(player);
        this.runningController.notifyChange(this.players);

        player.eventEmitter.emit("onRegistered");
    }

    public removePlayer (player: Player) {
        const removeFromList = (listToProcess: Array<Player>) => {
            let removed = false;
            const list = listToProcess.filter((existingPlayer) => {
                if (existingPlayer.id !== player.id) {
                    return true;
                }

                removed = true;

                return false;
            });

            return {
                list,
                removed
            };
        };

        const nextPlayers = removeFromList(this.players);
        const nextPlayersInRound = removeFromList(this.playersInRound);

        this.playersInRound = nextPlayersInRound.list;

        if (nextPlayersInRound.removed || nextPlayers.removed) {
            player.eventEmitter.emit("onRemoved");
            player.eventEmitter.removeAllListeners();
        }

        this.players = nextPlayers.list;
        this.runningController.notifyChange(this.players);
    }

    private async playRound (abortSignal: AbortSignal) {
        this.eventEmitter.emit("onRequestPlayersHand");

        await Promise.race([
            Promise.all(this.playersInRound.map(async (player) => {
                await new Promise<void>((resolve) => {
                    player.eventEmitter.once("onSetHand", () => resolve());
                    player.eventEmitter.once("onChangeStatus", () => resolve());
                    player.eventEmitter.once("onRemoved", () => resolve());
                });
            })),
            new Promise((_, reject) => abortSignal.addEventListener("abort", reject))
        ]);

        const playersSet = new Set(this.playersInRound);

        let numberOfPlayersInGame = playersSet.size,
            isDraw = false;

        while (playersSet.size > 1 && !isDraw) {
            const players = [...playersSet.values()];

            players.forEach((opponent1) => {
                players.forEach((opponent2) => {
                    if (opponent1 === opponent2) {
                        return;
                    }

                    switch (opponent1.currentHand?.checkAgainst(opponent2.currentHand)) {
                        case "won": {
                            playersSet.delete(opponent2);

                            return;
                        }

                        case "lose": {
                            playersSet.delete(opponent1);

                        }
                    }
                });
            });

            if (numberOfPlayersInGame === playersSet.size) {
                isDraw = true;
            } else {
                numberOfPlayersInGame = playersSet.size;
            }
        }

        return [...playersSet.values()];
    }

    public async play () {
        this.players.forEach((player) => {
            player.resetHand();
        });

        this.playersInRound = [...this.players.filter((player) => !player.isSpectator)];

        await this.runningController.run(async (stop, abortSignal) => {
            if (!this.playersInRound.length) {
                this.eventEmitter.emit("onNoPlayersLeft");

                stop();

                return;
            }

            this.eventEmitter.emit("onRound", this.playersInRound);

            try {
                const winners = await this.playRound(abortSignal);

                if (winners.length === 1) {
                    this.eventEmitter.emit("onWin", winners[0]);

                    stop();

                    return;
                }

                if (!winners.length || winners.length === this.playersInRound.length) {
                    this.eventEmitter.emit("onDraw", this.playersInRound);

                    return;
                }

                this.playersInRound = winners;

            } catch {
                if (this.playersInRound.length === 1) {
                    this.eventEmitter.emit("onWin", this.playersInRound[0]);
                } else {
                    this.eventEmitter.emit("onDraw", this.playersInRound);
                }
            }
        });
    }
}
