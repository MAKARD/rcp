import {Controller, Get, HttpStatus, InternalServerErrorException, Post, Put, Query} from "@nestjs/common";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {humanId} from "human-id";

import {LoggerService} from "../logger/logger.service";

import {CreateGameCommand} from "./commands/create-game.command";
import {FastForwardTimerCommand} from "./commands/fast-forward-timer.command";
import {GetGameStatusQuery} from "./queries/get-game-status.query";

@Controller("game")
export class GameController {
    constructor (
        private readonly commandBus: CommandBus,
        private readonly loggerService: LoggerService,
        private readonly queryBus: QueryBus
    ) {}

    @Post("/create")
    async create () {
        const id = humanId({
            "capitalize": false,
            "separator": "-"
        });

        try {
            await this.commandBus.execute(new CreateGameCommand(id));
        } catch (error) {
            this.loggerService.error(error.message, error.stack, "Game");

            throw new InternalServerErrorException("Internal error");
        }

        return {
            id
        };
    }

    @Get("/status")
    async status (@Query("gameId") gameId: string) {
        try {
            return await this.queryBus.execute(new GetGameStatusQuery(gameId));
        } catch (error) {
            this.loggerService.error(error.message, error.stack, "Game");

            throw new InternalServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put("/timer/fast-forward")
    async fastForwardTimer (@Query("gameId") gameId: string) {
        try {
            await this.commandBus.execute(new FastForwardTimerCommand(gameId));
        } catch (error) {
            this.loggerService.error(error.message, error.stack, "Game");

            throw new InternalServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
