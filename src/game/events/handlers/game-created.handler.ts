import {IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {GameCreatedEvent} from "../impl/game-created.event";

@EventsHandler(GameCreatedEvent)
export class GameCreatedHandler implements IEventHandler<GameCreatedEvent> {
    handle (event: GameCreatedEvent) {
    }
}
