import {EventsHandler, IEventHandler} from "@nestjs/cqrs";

import {PlayerJSONData} from "../interfaces/player.interface";
import {StatusUpdatesService} from "../services/status-updates.service";
import {LoggerService} from "../../logger/logger.service";
import {WithUnhandledExceptionBus} from "../decorators/with-unhandled-exception-bus.decorator";

export class PlayerAddedEvent {
    constructor (
        public readonly gameId: string,
        public readonly player: PlayerJSONData
    ) {}
}

@EventsHandler(PlayerAddedEvent)
export class PlayerAddedEventHandler implements IEventHandler<PlayerAddedEvent> {
    constructor (
        private readonly statusUpdatesService: StatusUpdatesService,
        private readonly loggerService: LoggerService
    ) {}

    @WithUnhandledExceptionBus()
    handle (event: PlayerAddedEvent) {
        const message = `Player ${event.player.name} added to ${event.gameId}`;

        this.loggerService.log(message, "Player");

        this.statusUpdatesService.publish(event.gameId, {
            event,
            "status": event.player.isSpectator
                ? "spectator_added"
                : "player_added"
        });
    }
}
