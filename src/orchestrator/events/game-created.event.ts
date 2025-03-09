import {EventsHandler, IEventHandler} from "@nestjs/cqrs";

import {StatusUpdatesService} from "../services/status-updates.service";
import {LoggerService} from "../../logger/logger.service";
import {WithUnhandledExceptionBus} from "../decorators/with-unhandled-exception-bus.decorator";

export class GameCreatedEvent {
    constructor (
        public readonly gameId: string
    ) {}
}

@EventsHandler(GameCreatedEvent)
export class GameCreatedEventHandler implements IEventHandler<GameCreatedEvent> {
    constructor (
        private readonly statusUpdatesService: StatusUpdatesService,
        private readonly loggerService: LoggerService
    ) {}

    @WithUnhandledExceptionBus()
    handle (event: GameCreatedEvent) {
        const message = `Game ${event.gameId} is created`;

        this.loggerService.log(message, "Game");

        this.statusUpdatesService.publish(event.gameId, {
            event,
            "status": "game_created"
        });
    }
}
