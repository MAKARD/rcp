import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";

import {GameRepository} from "../../repositories/game.repository";
import {MoveSpectatorToPlayersCommand} from "../impl/move-spectator-to-players.command";

@CommandHandler(MoveSpectatorToPlayersCommand)
export class MoveSpectatorToPlayersHandler implements ICommandHandler<MoveSpectatorToPlayersCommand> {
    constructor (
        private readonly repository: GameRepository,
        private readonly publisher: EventPublisher
    ) {}

    async execute (command: MoveSpectatorToPlayersCommand) {
        throw new Error("Not implemented");
    }
}
