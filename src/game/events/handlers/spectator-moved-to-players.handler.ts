import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {SpectatorMovedToPlayersEvent} from "../impl/spectator-moved-to-players.event";

@EventsHandler(SpectatorMovedToPlayersEvent)
export class SpectatorMovedToPlayersHandler implements IEventHandler<SpectatorMovedToPlayersEvent> {
    handle (event: SpectatorMovedToPlayersEvent) {
        throw new Error("Not implemented");
    }
}
