import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {PlayerInvalidHandEvent} from "../impl/player-invalid-hand.event";
import {GameGateway} from "../../game.gateway";

@EventsHandler(PlayerInvalidHandEvent)
export class PlayerInvalidHandHandler implements IEventHandler<PlayerInvalidHandEvent> {
    constructor (
        private readonly gameGateway: GameGateway
    ) {}

    handle (event: PlayerInvalidHandEvent) {
        const message = `Player ${event.player.name} cannot to set hand ${event.error.message}`;

        this.gameGateway.broadcastStatusWithinGame(event.gameId, {
            "status": "invalid_hand",
            message
        });
    }
}
