import {EventsHandler, IEventHandler} from "@nestjs/cqrs";

import {LoggerService} from "../../logger/logger.service";
import {PlayerJSONData} from "../interfaces/player.interface";
import {StatusUpdatesService} from "../services/status-updates.service";
import {WithUnhandledExceptionBus} from "../decorators/with-unhandled-exception-bus.decorator";

export class PlayerSetHandEvent {
    constructor (
        public readonly gameId: string,
        public readonly player: PlayerJSONData
    ) {}
}

@EventsHandler(PlayerSetHandEvent)
export class PlayerSetHandEventHandler implements IEventHandler<PlayerSetHandEvent> {
    constructor (
        private readonly statusUpdatesService: StatusUpdatesService,
        private readonly loggerService: LoggerService
    ) {}

    @WithUnhandledExceptionBus()
    handle (event: PlayerSetHandEvent) {
        const publicMessage = `Player ${event.player.name} set hand`;

        const privateMessage = `${publicMessage} ${event.player.currentHand}`;

        this.loggerService.log(privateMessage, "Player");

        this.statusUpdatesService.publish(event.gameId, {
            "event": {
                "gameId": event.gameId,
                "player": {
                    "id": event.player.id,
                    "name": event.player.name
                }
            },
            "status": "hand_set"
        });
    }
}
