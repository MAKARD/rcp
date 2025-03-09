import {EventsHandler, IEventHandler} from "@nestjs/cqrs";

import {LoggerService} from "../../logger/logger.service";
import {StatusUpdatesService} from "../services/status-updates.service";
import {PlayerJSONData} from "../interfaces/player.interface";
import {WithUnhandledExceptionBus} from "../decorators/with-unhandled-exception-bus.decorator";

export class PlayerInvalidHandEvent {
    constructor (
        public readonly gameId: string,
        public readonly player: PlayerJSONData,
        public readonly error: Error
    ) {}
}

@EventsHandler(PlayerInvalidHandEvent)
export class PlayerInvalidHandEventHandler implements IEventHandler<PlayerInvalidHandEvent> {
    constructor (
        private readonly statusUpdatesService: StatusUpdatesService,
        private readonly loggerService: LoggerService
    ) {}

    @WithUnhandledExceptionBus()
    handle (event: PlayerInvalidHandEvent) {
        const message = `Player ${event.player.name} cannot to set hand ${event.error.message}`;

        this.loggerService.log(message, "Player");

        this.statusUpdatesService.publish(event.gameId, {
            event,
            "status": "invalid_hand"
        });
    }
}
