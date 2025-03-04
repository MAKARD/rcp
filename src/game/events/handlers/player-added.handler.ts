import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {PlayerAddedEvent} from "../impl/player-added.event";

import {GameGateway} from "src/game/game.gateway";

@EventsHandler(PlayerAddedEvent)
export class PlayerAddedHandler implements IEventHandler<PlayerAddedEvent> {
    constructor (
        private readonly gameGateway: GameGateway
    ) {}

    handle (event: PlayerAddedEvent) {
        const message = `Player ${event.player.name} added to ${event.gameId}`;

        this.gameGateway.broadcastStatusWithinGame(event.gameId, {
            "status": event.player.isSpectator.getValue() ? "spectator_added" : "player_added",
            message
        });
    }
}
