import {CommandBus, CommandHandler, EventBus, EventPublisher, ICommandHandler} from "@nestjs/cqrs";

import {GameRepository} from "../repositories/game.repository";
import {GameModel} from "../models/game.model";
import {GameCreatedEvent} from "../events/game-created.event";

import {RequestPlayersHandsCommand} from "./request-players-hands.command";

export class CreateGameCommand {
    constructor (
        public readonly gameId: string
    ) {}
}

@CommandHandler(CreateGameCommand)
export class CreateGameCommandHandler implements ICommandHandler<CreateGameCommand> {
    constructor (
        private readonly repository: GameRepository,
        private readonly publisher: EventPublisher,
        private readonly commandBus: CommandBus,
        private readonly eventBus: EventBus
    ) {}

    async execute (command: CreateGameCommand) {
        const Game = this.publisher.mergeClassContext(GameModel);

        this.repository.insertOne(
            new Game(
                command.gameId,
                (players) => this.commandBus.execute(new RequestPlayersHandsCommand(command.gameId, players))
            )
        );

        this.eventBus.publish(new GameCreatedEvent(command.gameId));
    }
}
