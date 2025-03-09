import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";

import {GameRepository} from "../repositories/game.repository";

export class GetGameStatusQuery {
    constructor (
        public readonly gameId: string
    ) {}
}

@QueryHandler(GetGameStatusQuery)
export class GetGameStatusQueryHandler implements IQueryHandler<GetGameStatusQuery> {
    constructor (
        private readonly gameRepository: GameRepository
    ) {}

    async execute (query: GetGameStatusQuery) {
        const game = this.gameRepository.findOneByIdOrFail(query.gameId);

        return game.toJSON();
    }
}
