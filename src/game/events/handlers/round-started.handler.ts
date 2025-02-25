import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {RoundStartEvent} from "../impl/round-started.event";

@EventsHandler(RoundStartEvent)
export class RoundStartHandler implements IEventHandler<RoundStartEvent> {
    handle (event: RoundStartEvent) {
        console.log("Starting round in", event.gameId, "with", event.playersInRound.map((player) => player.name));
    }
}
