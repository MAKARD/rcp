import {EventsHandler, IEventHandler} from "@nestjs/cqrs";

import {LoggerService} from "../../logger/logger.service";
import {PlayerJSONData} from "../interfaces/player.interface";
import {StatusUpdatesService} from "../services/status-updates.service";
import {WithUnhandledExceptionBus} from "../decorators/with-unhandled-exception-bus.decorator";

export class PlayerRemovedEvent {
    constructor (
        public readonly gameId: string,
        public readonly player: PlayerJSONData
    ) {}
}

@EventsHandler(PlayerRemovedEvent)
export class PlayerRemovedEventHandler implements IEventHandler<PlayerRemovedEvent> {
    constructor (
        private readonly statusUpdatesService: StatusUpdatesService,
        private readonly loggerService: LoggerService
    ) {}

    @WithUnhandledExceptionBus()
    handle (event: PlayerRemovedEvent) {
        const message = `Player ${event.player.name} is removed from ${event.gameId}`;

        this.loggerService.log(message, "Player");

        this.statusUpdatesService.publish(event.gameId, {
            event,
            "status": event.player.isSpectator
                ? "spectator_removed"
                : "player_removed"
        });
    }
}
