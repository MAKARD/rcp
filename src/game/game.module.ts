import {Module} from "@nestjs/common";
import {CqrsModule} from "@nestjs/cqrs";

import {GameRepository} from "./repositories/game.repository";
import {TimerRepository} from "./repositories/timer.repository";
import {PlayerRepository} from "./repositories/player.repository";
import {CommandHandlers} from "./commands/handlers";
import {QueryHandlers} from "./queries/handlers";
import {EventHandlers} from "./events/handlers";
import {GameController} from "./game.controller";
import {GameGateway} from "./game.gateway";

@Module({
    "imports": [CqrsModule],
    "controllers": [GameController],
    "providers": [
        GameRepository,
        TimerRepository,
        PlayerRepository,
        GameGateway,
        ...CommandHandlers,
        ...QueryHandlers,
        ...EventHandlers
    ]
})
export class GameModule {}
