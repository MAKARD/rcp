import {EventsHandler, IEventHandler} from "@nestjs/cqrs";

import {PlayerJSONData} from "../interfaces/player.interface";
import {StatusUpdatesService} from "../services/status-updates.service";
import {LoggerService} from "../../logger/logger.service";
import {WithUnhandledExceptionBus} from "../decorators/with-unhandled-exception-bus.decorator";

export class GameEndedEvent {
    constructor (
        public readonly gameId: string,
        public readonly winner?: PlayerJSONData
    ) {}
}

@EventsHandler(GameEndedEvent)
export class GameEndedEventHandler implements IEventHandler<GameEndedEvent> {
    constructor (
        private readonly statusUpdatesService: StatusUpdatesService,
        private readonly loggerService: LoggerService
    ) {}

    @WithUnhandledExceptionBus()
    handle (event: GameEndedEvent) {
        let message = "";

        if (event.winner) {
            message = `Game ${event.gameId} won by ${event.winner.name} with ${event.winner.currentHand.toLowerCase()}`;
        } else {
            message = `Game ${event.gameId} is ended without a winner`;
        }

        this.loggerService.log(message, "Game");

        this.statusUpdatesService.publish(event.gameId, {
            event,
            "status": event.winner
                ? "game_ended_with_winner"
                : "game_ended_with_draw"
        });
    }
}
