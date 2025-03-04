import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {GameEndedEvent} from "../impl/game-ended.event";

import {GameGateway} from "src/game/game.gateway";

@EventsHandler(GameEndedEvent)
export class GameEndedHandler implements IEventHandler<GameEndedEvent> {
    constructor (
        private readonly gameGateway: GameGateway
    ) {}

    handle (event: GameEndedEvent) {
        let message = "";

        if (event.winner) {
            // eslint-disable-next-line max-len
            message = `Game ${event.gameId} won by ${event.winner.name} with ${event.winner.currentHand.getValue().toString().toLowerCase()}`;
        } else {
            message = `Game ${event.gameId} is ended without a winner`;
        }

        this.gameGateway.broadcastStatusWithinGame(event.gameId, {
            "status": event.winner ? "game_ended_with_winner" : "game_ended_with_draw",
            message
        });

    }
}
