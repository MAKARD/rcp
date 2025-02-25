import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";

import {GameRepository} from "../../repositories/game.repository";
import {MovePlayerToSpectatorsCommand} from "../impl/move-player-to-spectators.command";

@CommandHandler(MovePlayerToSpectatorsCommand)
export class MovePlayerToSpectatorsHandler implements ICommandHandler<MovePlayerToSpectatorsCommand> {
    constructor (
        private readonly repository: GameRepository,
        private readonly publisher: EventPublisher
    ) {}

    async execute (command: MovePlayerToSpectatorsCommand) {
        throw new Error("Not implemented");
    }
}
