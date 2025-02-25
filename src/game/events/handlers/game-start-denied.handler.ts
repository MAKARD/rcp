import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {GameStartDeniedEvent} from "../impl/game-start-denied.event";
import {TimerRepository} from "../../repositories/timer.repository";
import {GameRepository} from "../../repositories/game.repository";

@EventsHandler(GameStartDeniedEvent)
export class GameStartDeniedHandler implements IEventHandler<GameStartDeniedEvent> {
    constructor (
        private readonly timerRepository: TimerRepository,
        private readonly gameRepository: GameRepository
    ) {}

    async handle (event: GameStartDeniedEvent) {
        console.log("Game", event.gameId, "is denied to start");

        const timer = this.timerRepository.findOneById(event.gameId);

        timer?.reset();

        const game = this.gameRepository.findOneById(event.gameId);

        // console.log("HERE5");
        // game?.abortController?.abort();
    }
}
