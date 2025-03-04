import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {RoundStartEvent} from "../impl/round-started.event";

import {GameGateway} from "src/game/game.gateway";

@EventsHandler(RoundStartEvent)
export class RoundStartHandler implements IEventHandler<RoundStartEvent> {
    constructor (
        private readonly gameGateway: GameGateway
    ) {}

    handle (event: RoundStartEvent) {
        const message = `Starting round in ${event.gameId} with ${event.playersInRound.map((player) => player.name)}`;

        this.gameGateway.broadcastStatusWithinGame(event.gameId, {
            "status": "round_started",
            message
        });
    }
}
