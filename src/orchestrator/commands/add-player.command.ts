import {CommandHandler, EventBus, ICommandHandler} from "@nestjs/cqrs";
import {Socket} from "socket.io";

import {PlayerRepository} from "../repositories/player.repository";
import {GameRepository} from "../repositories/game.repository";
import {PlayerModel} from "../models/player.model";
import {PlayerAddedEvent} from "../events/player-added.event";

export class AddPlayerCommand {
    constructor (
        public readonly gameId: string,
        public readonly id: string,
        public readonly name: string,
        public readonly socket: Socket
    ) {}
}

@CommandHandler(AddPlayerCommand)
export class AddPlayerCommandHandler implements ICommandHandler<AddPlayerCommand> {
    constructor (
        private readonly playerRepository: PlayerRepository,
        private readonly gameRepository: GameRepository,
        private readonly eventBus: EventBus
    ) {}

    async execute (command: AddPlayerCommand) {
        const game = this.gameRepository.findOneByIdOrFail(command.gameId);

        const player = new PlayerModel(command.id, command.name, command.socket);

        game.addPlayer(player);

        this.playerRepository.insertOne(player);

        this.eventBus.publish(new PlayerAddedEvent(command.gameId, player));
    }
}
