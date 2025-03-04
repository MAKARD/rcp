import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {RoundDrawnEvent} from "../impl/round-drawn.event";
import {GameGateway} from "../../game.gateway";

@EventsHandler(RoundDrawnEvent)
export class RoundDrawnHandler implements IEventHandler<RoundDrawnEvent> {
    constructor (
        private readonly gameGateway: GameGateway
    ) {}

    handle (event: RoundDrawnEvent) {
        // eslint-disable-next-line max-len
        const message = `Round ends with a draw in ${event.gameId} with ${event.playersInRound.map((player) => player.name)}`;

        this.gameGateway.broadcastStatusWithinGame(event.gameId, {
            // TODO: typify
            "status": "round_drawn",
            message
        });
    }
}
