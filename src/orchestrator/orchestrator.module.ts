import {Module} from "@nestjs/common";
import {CqrsModule, EventBus, UnhandledExceptionBus} from "@nestjs/cqrs";

import {LoggerModule} from "../logger/logger.module";

import {GameController} from "./game.controller";
import {GameGateway} from "./game.gateway";
import {GameRepository} from "./repositories/game.repository";
import {TimerRepository} from "./repositories/timer.repository";
import {CommandHandlers} from "./commands";
import {QueryHandlers} from "./queries";
import {EventHandlers} from "./events";
import {StatusUpdatesService} from "./services/status-updates.service";
import {PlayerRepository} from "./repositories/player.repository";
import {ExceptionEvent} from "./events/exception.event";

@Module({
    "controllers": [GameController],
    "imports": [CqrsModule, LoggerModule],
    "providers": [
        StatusUpdatesService,
        GameRepository,
        TimerRepository,
        PlayerRepository,
        GameGateway,
        ...CommandHandlers,
        ...QueryHandlers,
        ...EventHandlers
    ]
})
export class OrchestratorModule {
    constructor (
        gameGateway: GameGateway,
        statusUpdatesService: StatusUpdatesService,
        unhandledExceptionsBus: UnhandledExceptionBus,
        eventBus: EventBus
    ) {
        statusUpdatesService.setBroadcastDelegate(gameGateway);

        unhandledExceptionsBus
            .subscribe((exceptionInfo) => {
                eventBus.publish(new ExceptionEvent(exceptionInfo.exception, exceptionInfo.cause));
            });
    }
}
