import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {RoundDrawnEvent} from "../impl/round-drawn.event";

@EventsHandler(RoundDrawnEvent)
export class RoundDrawnHandler implements IEventHandler<RoundDrawnEvent> {
    handle (event: RoundDrawnEvent) {
        console.log(
            "Round ends with a draw in",
            event.gameId,
            "with",
            event.playersInRound.map((player) => player.name)
        );
    }
}
