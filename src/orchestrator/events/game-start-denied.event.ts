import {EventsHandler, IEventHandler} from "@nestjs/cqrs";

import {LoggerService} from "../../logger/logger.service";
import {TimerRepository} from "../repositories/timer.repository";
import {StatusUpdatesService} from "../services/status-updates.service";
import {WithUnhandledExceptionBus} from "../decorators/with-unhandled-exception-bus.decorator";

export class GameStartDeniedEvent {
    constructor (
        public readonly gameId: string
    ) {}
}

@EventsHandler(GameStartDeniedEvent)
export class GameStartDeniedEventHandler implements IEventHandler<GameStartDeniedEvent> {
    constructor (
        private readonly statusUpdatesService: StatusUpdatesService,
        private readonly timerRepository: TimerRepository,
        private readonly loggerService: LoggerService
    ) {}

    @WithUnhandledExceptionBus()
    async handle (event: GameStartDeniedEvent) {
        const timer = this.timerRepository.findOneById(event.gameId);

        timer?.reset();

        const message = `Game ${event.gameId} is denied to start`;

        this.loggerService.log(message, "Game");

        this.statusUpdatesService.publish(event.gameId, {
            event,
            "status": "game_is_denied_to_start"
        });
    }
}
