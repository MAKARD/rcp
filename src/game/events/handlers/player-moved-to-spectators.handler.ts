import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {PlayerMovedToSpectatorsEvent} from "../impl/player-moved-to-spectators.event";

@EventsHandler(PlayerMovedToSpectatorsEvent)
export class PlayerMovedToSpectatorsHandler implements IEventHandler<PlayerMovedToSpectatorsEvent> {
    handle (event: PlayerMovedToSpectatorsEvent) {
        throw new Error("Not implemented");
    }
}
