import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {PlayerRemovedEvent} from "../impl/player-removed.event";

@EventsHandler(PlayerRemovedEvent)
export class PlayerRemovedHandler implements IEventHandler<PlayerRemovedEvent> {
    handle (event: PlayerRemovedEvent) {
        console.log("Player", event.player.name, "is removed from", event.gameId);
    }
}
