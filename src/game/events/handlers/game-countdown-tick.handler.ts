import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {GameCountdownTickEvent} from "../impl/game-countdown-tick.event";

import {GameGateway} from "src/game/game.gateway";

@EventsHandler(GameCountdownTickEvent)
export class GameCountdownTickHandler implements IEventHandler<GameCountdownTickEvent> {
    constructor (
        private readonly gameGateway: GameGateway
    ) {}

    handle (event: GameCountdownTickEvent) {
        const message = `Starting game ${event.gameId} in ${event.timeLeft} seconds`;

        this.gameGateway.broadcastStatusWithinGame(event.gameId, {
            "status": "timer_tick",
            message
        });
    }
}
