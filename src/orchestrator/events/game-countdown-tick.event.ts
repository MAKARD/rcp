import {EventsHandler, IEventHandler} from "@nestjs/cqrs";

import {StatusUpdatesService} from "../services/status-updates.service";
import {LoggerService} from "../../logger/logger.service";
import {WithUnhandledExceptionBus} from "../decorators/with-unhandled-exception-bus.decorator";

export class GameCountdownTickEvent {
    constructor (
        public readonly gameId: string,
        public readonly timeLeft: number
    ) {}
}

@EventsHandler(GameCountdownTickEvent)
export class GameCountdownTickEventHandler implements IEventHandler<GameCountdownTickEvent> {
    constructor (
        private readonly statusUpdatesService: StatusUpdatesService,
        private readonly loggerService: LoggerService
    ) {}

    @WithUnhandledExceptionBus()
    handle (event: GameCountdownTickEvent) {
        const message = `Starting game ${event.gameId} in ${event.timeLeft} seconds`;

        this.loggerService.log(message, "Game");

        this.statusUpdatesService.publish(event.gameId, {
            event,
            "status": "timer_tick"
        });
    }
}
