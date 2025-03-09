import {CommandHandler, EventBus, ICommandHandler} from "@nestjs/cqrs";

import {PlayerRepository} from "../repositories/player.repository";
import {GameRepository} from "../repositories/game.repository";
import {PlayerRemovedEvent} from "../events/player-removed.event";
import {WithUnhandledExceptionBus} from "../decorators/with-unhandled-exception-bus.decorator";

export class RemovePlayerCommand {
    constructor (
        public readonly gameId: string,
        public readonly playerId: string
    ) {}
}

@CommandHandler(RemovePlayerCommand)
export class RemovePlayerCommandHandler implements ICommandHandler<RemovePlayerCommand> {
    constructor (
        private readonly playerRepository: PlayerRepository,
        private readonly gameRepository: GameRepository,
        private readonly eventBus: EventBus
    ) {}

    @WithUnhandledExceptionBus()
    async execute (command: RemovePlayerCommand) {
        const player = this.playerRepository.findOneByIdOrFail(command.playerId);

        player.socket.removeAllListeners();

        this.playerRepository.deleteOneById(player.id);

        const game = this.gameRepository.findOneByIdOrFail(command.gameId);

        game.removePlayer(player.id);

        this.eventBus.publish(new PlayerRemovedEvent(command.gameId, player));
    }
}
