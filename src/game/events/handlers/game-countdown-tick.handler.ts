import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {GameCountdownTickEvent} from "../impl/game-countdown-tick.event";

@EventsHandler(GameCountdownTickEvent)
export class GameCountdownTickHandler implements IEventHandler<GameCountdownTickEvent> {
    handle (event: GameCountdownTickEvent) {
        console.log("Starting game", event.gameId, "in", event.timeLeft, "seconds");
    }
}
