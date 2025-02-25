import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {PlayerAddedEvent} from "../impl/player-added.event";

@EventsHandler(PlayerAddedEvent)
export class PlayerAddedHandler implements IEventHandler<PlayerAddedEvent> {
    handle (event: PlayerAddedEvent) {
        console.log("Player", event.player.name, "added to", event.player.gameId.getValue());
    }
}
