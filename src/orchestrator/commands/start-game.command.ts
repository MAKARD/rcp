import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";

import {GameRepository} from "../repositories/game.repository";
import {WithUnhandledExceptionBus} from "../decorators/with-unhandled-exception-bus.decorator";

export class StartGameCommand {
    constructor (
        public readonly gameId: string
    ) {}
}

@CommandHandler(StartGameCommand)
export class StartGameCommandHandler implements ICommandHandler<StartGameCommand> {
    constructor (
        private readonly repository: GameRepository
    ) {}

    @WithUnhandledExceptionBus()
    async execute (command: StartGameCommand) {
        const game = this.repository.findOneByIdOrFail(command.gameId);

        game.start();
    }
}
