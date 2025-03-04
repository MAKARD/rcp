import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {PlayerRemovedEvent} from "../impl/player-removed.event";

import {GameGateway} from "src/game/game.gateway";

@EventsHandler(PlayerRemovedEvent)
export class PlayerRemovedHandler implements IEventHandler<PlayerRemovedEvent> {
    constructor (
        private readonly gameGateway: GameGateway
    ) {}

    handle (event: PlayerRemovedEvent) {
        const message = `Player ${event.player.name} is removed from ${event.gameId}`;

        this.gameGateway.broadcastStatusWithinGame(event.gameId, {
            "status": event.player.isSpectator.getValue() ? "spectator_removed" : "player_removed",
            message
        });
    }
}
