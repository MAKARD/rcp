import {EventsHandler, IEventHandler} from "@nestjs/cqrs";

import {LoggerService} from "../../logger/logger.service";
import {StatusUpdatesService} from "../services/status-updates.service";
import {PlayerJSONData} from "../interfaces/player.interface";
import {WithUnhandledExceptionBus} from "../decorators/with-unhandled-exception-bus.decorator";

export class RoundStartEvent {
    constructor (
        public readonly gameId: string,
        public readonly playersInRound: Array<PlayerJSONData>
    ) {}
}

@EventsHandler(RoundStartEvent)
export class RoundStartEventHandler implements IEventHandler<RoundStartEvent> {
    constructor (
        private readonly statusUpdatesService: StatusUpdatesService,
        private readonly loggerService: LoggerService
    ) {}

    @WithUnhandledExceptionBus()
    handle (event: RoundStartEvent) {
        const message = `Starting round in ${event.gameId} with ${event.playersInRound.map((player) => player.name)}`;

        this.loggerService.log(message, "Round");

        this.statusUpdatesService.publish(event.gameId, {
            event,
            "status": "round_started"
        });
    }
}
