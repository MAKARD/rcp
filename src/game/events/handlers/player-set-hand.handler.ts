import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {PlayerSetHandEvent} from "../impl/player-set-hand.event";

import {GameGateway} from "src/game/game.gateway";

@EventsHandler(PlayerSetHandEvent)
export class PlayerSetHandHandler implements IEventHandler<PlayerSetHandEvent> {
    constructor (
        private readonly gameGateway: GameGateway
    ) {}

    handle (event: PlayerSetHandEvent) {
        const publicMessage = `Player ${event.player.name} set hand`;

        const privateMessage = `${publicMessage} ${event.player.currentHand.getValue().toString()}`;

        this.gameGateway.broadcastStatusWithinGame(event.gameId, {
            "status": "hand_set",
            "message": publicMessage
        });
    }
}
