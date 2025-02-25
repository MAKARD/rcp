import * as crypto from "crypto";

import {Controller, Post} from "@nestjs/common";
import {CommandBus} from "@nestjs/cqrs";

import {CreateGameCommand} from "./commands/impl/create-game.command";

@Controller("game")
export class GameController {
    constructor (
        private readonly commandBus: CommandBus
    ) {}

    @Post("/create")
    async create () {
        const id = crypto.randomUUID();
        await this.commandBus.execute(new CreateGameCommand(id));

        return {
            id
        };
    }
}
