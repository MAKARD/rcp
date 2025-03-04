import {CommandHandler, EventBus, ICommandHandler} from "@nestjs/cqrs";

import {PlayerRepository} from "../../repositories/player.repository";
import {RequestPlayersHandsCommand} from "../impl/request-players-hands.command";
import {GameGateway} from "../../game.gateway";
import {PlayerSetHandEvent} from "../../events/impl/player-set-hand.event";
import {PlayerInvalidHandEvent} from "../../events/impl/player-invalid-hand.event";

@CommandHandler(RequestPlayersHandsCommand)
export class RequestPlayersHandsHandler implements ICommandHandler<RequestPlayersHandsCommand> {
    constructor (
        private readonly playerRepository: PlayerRepository,
        private readonly eventBus: EventBus,
        private readonly gameGateway: GameGateway
    ) {}

    async execute (command: RequestPlayersHandsCommand) {
        const sockets = await this.gameGateway.getConnectedClientsInGame(command.gameId);

        sockets.forEach((socket) => {
            const player = this.playerRepository.findOneByIdOrFail(socket.id);

            const acknowledgeCallback = (timeoutError: Error | null, hand: string) => {
                if (hand === "INTERNAL_FORWARD_HAND_TIMER" || timeoutError) {
                    // TODO: reconsider this line
                    socket.disconnect();

                    return;
                }

                try {
                    player.setHandFromString(hand);

                    this.eventBus.publish(new PlayerSetHandEvent(command.gameId, player));
                } catch (handError) {
                    this.eventBus.publish(new PlayerInvalidHandEvent(command.gameId, player, handError));

                    socket.timeout(10000).emit("player/hand:request", acknowledgeCallback);
                }
            };

            socket.timeout(10000).emit("player/hand:request", acknowledgeCallback);
        });
    }
}
