import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";

import {GameRepository} from "../../repositories/game.repository";
import {GetGameStatusQuery} from "../impl/get-game-status.query";

@QueryHandler(GetGameStatusQuery)
export class GetGameStatusHandler implements IQueryHandler<GetGameStatusQuery> {
    constructor (
        private readonly gameRepository: GameRepository
    ) {}

    async execute (query: GetGameStatusQuery) {
        const game = this.gameRepository.findOneByIdOrFail(query.gameId);

        return {
            "id": game.id,
            "isRunning": game.isRunning.getValue(),
            "players": game.getPlayers().filter((player) => !player.isSpectator.getValue()),
            "spectators": game.getPlayers().filter((player) => player.isSpectator.getValue())
        };
    }
}
