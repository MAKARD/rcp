import {CommandHandler, EventBus, ICommandHandler} from "@nestjs/cqrs";

import {PlayerRepository} from "../../repositories/player.repository";
import {RequestPlayersHandsCommand} from "../impl/request-players-hands.command";
import {GameGateway} from "../../game.gateway";

import {PlayerSetHandEvent} from "src/game/events/impl/player-set-hand.event";

@CommandHandler(RequestPlayersHandsCommand)
export class RequestPlayersHandsHandler implements ICommandHandler<RequestPlayersHandsCommand> {
    constructor (
        private readonly playerRepository: PlayerRepository,
        private readonly eventBus: EventBus,
        private readonly gameGateway: GameGateway
    ) {}

    async execute (command: RequestPlayersHandsCommand) {
        this.gameGateway.emitHandRequestWithAcknowledge(command.gameId, async (playerId, hand) => {
            const player = this.playerRepository.findOneByIdOrFail(playerId);

            try {
                player.setHandFromString(hand);

                this.eventBus.publish(new PlayerSetHandEvent(player));
            } catch (error) {
                console.log("Player", player.name, "cannot set", hand, "hand", error);
            }
        });
    }
}
