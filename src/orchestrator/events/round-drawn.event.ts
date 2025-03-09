import {EventsHandler, IEventHandler} from "@nestjs/cqrs";

import {LoggerService} from "../../logger/logger.service";
import {PlayerJSONData} from "../interfaces/player.interface";
import {StatusUpdatesService} from "../services/status-updates.service";
import {WithUnhandledExceptionBus} from "../decorators/with-unhandled-exception-bus.decorator";

export class RoundDrawnEvent {
    constructor (
        public readonly gameId: string,
        public readonly playersInRound: Array<PlayerJSONData>
    ) {}
}

@EventsHandler(RoundDrawnEvent)
export class RoundDrawnEventHandler implements IEventHandler<RoundDrawnEvent> {
    constructor (
        private readonly statusUpdatesService: StatusUpdatesService,
        private readonly loggerService: LoggerService
    ) {}

    @WithUnhandledExceptionBus()
    handle (event: RoundDrawnEvent) {
        // eslint-disable-next-line max-len
        const message = `Round ends with a draw in ${event.gameId} with ${event.playersInRound.map((player) => player.name)}`;

        this.loggerService.log(message, "Round");

        this.statusUpdatesService.publish(event.gameId, {
            event,
            "status": "round_drawn"
        });
    }
}
