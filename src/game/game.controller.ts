import * as crypto from "crypto";

import {Controller, Get, Post, Put, Query} from "@nestjs/common";
import {CommandBus, QueryBus} from "@nestjs/cqrs";

import {CreateGameCommand} from "./commands/impl/create-game.command";
import {FastForwardTimerCommand} from "./commands/impl/fast-forward-timer.command";
import {GetGameStatusQuery} from "./queries/impl/get-game-status.query";

@Controller("game")
export class GameController {
    constructor (
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    @Post("/create")
    async create (@Query("gameId") gameId: string) {
        const id = crypto.randomUUID();
        await this.commandBus.execute(new CreateGameCommand(id));

        return {
            id
        };
    }

    @Get("/status")
    status (@Query("gameId") gameId: string) {
        return this.queryBus.execute(new GetGameStatusQuery(gameId));
    }

    @Put("/timer/fast-forward")
    fastForwardTimer (@Query("gameId") gameId: string) {
        this.commandBus.execute(new FastForwardTimerCommand(gameId));
    }
}
