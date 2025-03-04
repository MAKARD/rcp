import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";

import {GameModel} from "../../models/game.model";
import {GameRepository} from "../../repositories/game.repository";
import {CreateGameCommand} from "../impl/create-game.command";

@CommandHandler(CreateGameCommand)
export class CreateGameHandler implements ICommandHandler<CreateGameCommand> {
    constructor (
        private readonly repository: GameRepository,
        private readonly publisher: EventPublisher
    ) {}

    async execute (command: CreateGameCommand) {
        const Game = this.publisher.mergeClassContext(GameModel);

        this.repository.insertOne(new Game(command.gameId));
    }
}
