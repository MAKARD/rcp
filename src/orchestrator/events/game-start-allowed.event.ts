import {CommandBus, EventBus, EventsHandler, IEventHandler} from "@nestjs/cqrs";

import {LoggerService} from "../../logger/logger.service";
import {StatusUpdatesService} from "../services/status-updates.service";
import {TimerRepository} from "../repositories/timer.repository";
import {StartGameCommand} from "../commands/start-game.command";
import {WithUnhandledExceptionBus} from "../decorators/with-unhandled-exception-bus.decorator";

import {GameCountdownTickEvent} from "./game-countdown-tick.event";

export class GameStartAllowedEvent {
    constructor (
        public readonly gameId: string
    ) {}
}

@EventsHandler(GameStartAllowedEvent)
export class GameStartAllowedEventHandler implements IEventHandler<GameStartAllowedEvent> {
    constructor (
        private readonly statusUpdatesService: StatusUpdatesService,
        private readonly timerRepository: TimerRepository,
        private readonly loggerService: LoggerService,
        private readonly commandBus: CommandBus,
        private readonly eventBus: EventBus
    ) {}

    @WithUnhandledExceptionBus()
    async handle (event: GameStartAllowedEvent) {
        const message = `Game ${event.gameId} is allowed to start`;

        this.loggerService.log(message, "Game");

        this.statusUpdatesService.publish(event.gameId, {
            event,
            "status": "game_is_allowed_to_start"
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
