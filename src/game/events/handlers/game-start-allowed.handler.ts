import {CommandBus, EventBus, IEventHandler} from "@nestjs/cqrs";
import {EventsHandler} from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {GameStartAllowedEvent} from "../impl/game-start-allowed.event";
import {GameCountdownTickEvent} from "../impl/game-countdown-tick.event";
import {StartGameCommand} from "../../commands/impl/start-game.command";
import {TimerRepository} from "../../repositories/timer.repository";
import {GameGateway} from "../../game.gateway";

@EventsHandler(GameStartAllowedEvent)
export class GameStartAllowedHandler implements IEventHandler<GameStartAllowedEvent> {
    constructor (
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus,
        private readonly gameGateway: GameGateway,
        private readonly timerRepository: TimerRepository
    ) {}

    async handle (event: GameStartAllowedEvent) {
        const message = `Game ${event.gameId} is allowed to start`;

        this.gameGateway.broadcastStatusWithinGame(event.gameId, {
            "status": "game_is_allowed_to_start",
            message
        });

        const timer = this.timerRepository.createOneById(event.gameId);

        timer.timeLeft.subscribe((timeLeft) => {
            if (timeLeft === 0) {
                this.commandBus.execute(new StartGameCommand(event.gameId));

                return;
            }

            this.eventBus.publish(new GameCountdownTickEvent(event.gameId, timeLeft));
        });
    }
}
