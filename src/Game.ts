import EventEmitter from "node:events";

import {HandFactory} from "./Hand/HandFactory";
import {Player} from "./Player";

interface GameEvents {
    "onDraw": [];
    "onEnd": [];
    "onWin": [
        winner: Player
    ];
    "onNextRound": [
        playersInGame: Array<Player>
    ];
    "onInvalidHandProvided": [
        handName: string,
        playerName: string
    ];
}

export class Game {
    private eventEmitter = new EventEmitter<GameEvents>();

    constructor (
        private players: [Player, Player, ...players: Array<Player>],
        private getPlayerChoice: (playerName: string) => Promise<string>
    ) {}

    public addListener<T extends keyof GameEvents>(name: T, listener: (...args: GameEvents[T]) => void) {
        this.eventEmitter.addListener(name, listener as never);

        return () => this.eventEmitter.removeListener(name, listener as never);
    }

    private async playRound (playersInRound: Array<Player>) {
        for (const player of playersInRound) {
            let attempts = 0,
                playerChoice = "";

            while (!HandFactory.availableHandsNames.includes(playerChoice?.toLowerCase())) {
                if (attempts > 0) {
                    this.eventEmitter.emit("onInvalidHandProvided", playerChoice, player.name);
                }

                playerChoice = await this.getPlayerChoice(player.name);

                attempts ++;
            }

            player.setHand(HandFactory.createFromString(playerChoice));
        }

        const playersSet = new Set(playersInRound);

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

    public async play (): Promise<Player> {
        this.players.forEach((player) => player.resetHand());

        let winner: Player | undefined,

            playersInGame: Array<Player> = this.players;

        while (!winner) {
            const winners = await this.playRound(playersInGame);

            if (!winners.length) {
                this.eventEmitter.emit("onDraw");

                continue;
            }

            if (winners.length === playersInGame.length) {
                this.eventEmitter.emit("onDraw");

                continue;
            }

            if (winners.length === 1) {
                winner = winners[0];

                this.eventEmitter.emit("onWin", winner);

                break;
            }

            playersInGame = winners;

            this.eventEmitter.emit("onNextRound", playersInGame);
        }

        this.eventEmitter.emit("onEnd");

        return winner;
    }
}
