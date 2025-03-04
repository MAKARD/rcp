import {CommandBus, CommandHandler, EventBus, ICommandHandler} from "@nestjs/cqrs";
import {Subscription} from "rxjs";

import {Player} from "../../interfaces/player.interface";
import {RoundStartEvent} from "../../events/impl/round-started.event";
import {StartGameCommand} from "../impl/start-game.command";
import {GameEndedEvent} from "../../events/impl/game-ended.event";
import {RoundDrawnEvent} from "../../events/impl/round-drawn.event";
import {RequestPlayersHandsCommand} from "../impl/request-players-hands.command";
import {GameRepository} from "../../repositories/game.repository";
import {Game} from "../../interfaces/game.interface";

class AbortError extends Error {}

@CommandHandler(StartGameCommand)
export class StartGameHandler implements ICommandHandler<StartGameCommand> {
    constructor (
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus,
        private readonly repository: GameRepository
    ) {}

    private async playRound (game: Game, playersInRound: Array<Player>) {
        this.commandBus.execute(new RequestPlayersHandsCommand(game.id));

        const subscriptions = new Subscription();

        await Promise.race([
            Promise.all(playersInRound.map(async (player) => {
                await new Promise<void>((resolve) => {
                    subscriptions.add(player.currentHand.subscribe(() => resolve()));
                    subscriptions.add(player.gameId.subscribe(() => resolve()));
                });
            })),
            new Promise((_, reject) => game.abortController?.signal
                .addEventListener("abort", () => reject(new AbortError())))
        ]).finally(() => {
            subscriptions.unsubscribe();
        });

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

                    switch (opponent1.currentHand.getValue().checkAgainst(opponent2.currentHand.getValue())) {
                        case "win": {
                            playersSet.delete(opponent2);
                            break;
                        }

                        case "lose":{
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

    async execute (command: StartGameCommand) {
        const game = this.repository.findOneByIdOrFail(command.gameId);

        game.prepareToStart();

        let playersInRound = game.getPlayers();

        const subscriptions = new Subscription();

        playersInRound.forEach((player) => {
            subscriptions.add(
                player.gameId.subscribe((gameId) => {
                    if (!gameId) {
                        playersInRound = playersInRound.filter((playerInRound) => player.id !== playerInRound.id);
                    }
                })
            );
        });

        while (game.isRunning.getValue()) {
            try {
                // TODO reconsider this check
                if (playersInRound.length < 2) {
                    throw new AbortError();
                }

                this.eventBus.publish(new RoundStartEvent(command.gameId, playersInRound));

                const winners = await this.playRound(game, playersInRound);

                if (winners.length === 1) {
                    this.eventBus.publish(new GameEndedEvent(command.gameId, winners[0]));

                    game.abortController?.abort();

                    return;
                }

                if (!winners.length || winners.length === playersInRound.length) {
                    this.eventBus.publish(new RoundDrawnEvent(command.gameId, playersInRound));

                    continue;
                }

                playersInRound = winners;

            } catch (error) {
                if (!(error instanceof AbortError)) {
                    throw error;
                }

                if (playersInRound.length === 1) {
                    this.eventBus.publish(new GameEndedEvent(command.gameId, playersInRound[0]));
                } else {
                    this.eventBus.publish(new RoundDrawnEvent(command.gameId, playersInRound));
                }
            }
        }

        subscriptions.unsubscribe();
    }
}
