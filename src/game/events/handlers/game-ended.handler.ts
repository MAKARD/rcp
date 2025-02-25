import {CommandBus, IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {GameEndedEvent} from "../impl/game-ended.event";

@EventsHandler(GameEndedEvent)
export class GameEndedHandler implements IEventHandler<GameEndedEvent> {
    constructor (
        private readonly commandBus: CommandBus
    ) {}

    handle (event: GameEndedEvent) {
        if (event.winner) {
            console.log(
                "Game",
                event.gameId,
                "won by",
                event.winner.name,
                "with",
                event.winner.currentHand.getValue().toString()
            );
        } else {
            console.log("Game is ended without a winner");
        }
    }
}
