import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";

import {GameRepository} from "../../repositories/game.repository";
import {RemovePlayerCommand} from "../impl/remove-player.command";
import {PlayerRepository} from "../../repositories/player.repository";

@CommandHandler(RemovePlayerCommand)
export class RemovePlayerHandler implements ICommandHandler<RemovePlayerCommand> {
    constructor (
        private readonly gameRepository: GameRepository,
        private readonly playerRepository: PlayerRepository
    ) {}

    async execute (command: RemovePlayerCommand) {
        const player = this.playerRepository.findOneByIdOrFail(command.playerId);

        const game = this.gameRepository.findOneByIdOrFail(command.gameId);

        game.removePlayer(player);
        player.gameId.setValue(undefined);

        this.playerRepository.deleteOneById(player.id);
    }
}
