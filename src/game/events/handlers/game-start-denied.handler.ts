import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {GameStartDeniedEvent} from "../impl/game-start-denied.event";
import {TimerRepository} from "../../repositories/timer.repository";
import {GameRepository} from "../../repositories/game.repository";

import {GameGateway} from "src/game/game.gateway";

@EventsHandler(GameStartDeniedEvent)
export class GameStartDeniedHandler implements IEventHandler<GameStartDeniedEvent> {
    constructor (
        private readonly timerRepository: TimerRepository,
        private readonly gameRepository: GameRepository,
        private readonly gameGateway: GameGateway
    ) {}

    async handle (event: GameStartDeniedEvent) {
        const message = `Game ${event.gameId} is denied to start`;

        this.gameGateway.broadcastStatusWithinGame(event.gameId, {
            "status": "game_is_denied_to_start",
            message
        });

        const timer = this.timerRepository.findOneById(event.gameId);

        timer?.reset();

        const game = this.gameRepository.findOneById(event.gameId);

        game?.abortController?.abort();
    }
}
