import {CommandBus, CommandHandler, EventBus, ICommandHandler} from "@nestjs/cqrs";

import {PlayerJSONData} from "../interfaces/player.interface";
import {PlayerRepository} from "../repositories/player.repository";
import {PlayerSetHandEvent} from "../events/player-set-hand.event";
import {PlayerInvalidHandEvent} from "../events/player-invalid-hand.event";
import {WithUnhandledExceptionBus} from "../decorators/with-unhandled-exception-bus.decorator";

import {RemovePlayerCommand} from "./remove-player.command";

export class RequestPlayersHandsCommand {
    constructor (
        public readonly gameId: string,
        public readonly players: Array<PlayerJSONData>
    ) {}
}

@CommandHandler(RequestPlayersHandsCommand)
export class RequestPlayersHandsCommandHandler implements ICommandHandler<RequestPlayersHandsCommand> {
    constructor (
        private readonly playerRepository: PlayerRepository,
        private readonly commandBus: CommandBus,
        private readonly eventBus: EventBus
    ) {}

    @WithUnhandledExceptionBus()
    async execute (command: RequestPlayersHandsCommand) {
        const players = command.players.map((player) => this.playerRepository.findOneByIdOrFail(player.id));

        players.forEach((player) => {
            const acknowledgeCallback = (timeoutError: Error | null, hand: string) => {
                if (hand === "INTERNAL_FORWARD_HAND_TIMER" || timeoutError) {
                    this.commandBus.execute(new RemovePlayerCommand(command.gameId, player.id));

                    return;
                }

                try {
                    player.setHandFromString(hand);

                    this.eventBus.publish(new PlayerSetHandEvent(command.gameId, player));
                } catch (handError) {
                    this.eventBus.publish(new PlayerInvalidHandEvent(command.gameId, player, handError));

                    player.socket.timeout(10000).emit("player/hand:request", acknowledgeCallback);
                }
            };

            player.socket.timeout(10000).emit("player/hand:request", acknowledgeCallback);
        });
    }
}
