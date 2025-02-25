import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";

import {GameRepository} from "../../repositories/game.repository";
import {AddPlayerCommand} from "../impl/add-player.command";
import {PlayerModel} from "../../models/player.model";
import {PlayerRepository} from "../../repositories/player.repository";

@CommandHandler(AddPlayerCommand)
export class AddPlayerHandler implements ICommandHandler<AddPlayerCommand> {
    constructor (
        private readonly playerRepository: PlayerRepository,
        private readonly gameRepository: GameRepository,
        private readonly publisher: EventPublisher
    ) {}

    async execute (command: AddPlayerCommand) {
        const Player = this.publisher.mergeClassContext(PlayerModel);

        const game = this.gameRepository.findOneByIdOrFail(command.gameId);

        const player = new Player(command.id, command.name);

        this.playerRepository.insertOne(player);

        player.gameId.setValue(game.id);

        game.addPlayer(player);
    }
}
