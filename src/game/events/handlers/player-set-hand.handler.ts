import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {PlayerSetHandEvent} from "../impl/player-set-hand.event";

@EventsHandler(PlayerSetHandEvent)
export class PlayerSetHandHandler implements IEventHandler<PlayerSetHandEvent> {
    handle (event: PlayerSetHandEvent) {
        console.log("Player", event.player.name, "sets hand", event.player.currentHand.getValue().toString());
    }
}
