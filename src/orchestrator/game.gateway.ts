import * as crypto from "node:crypto";

import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {CommandBus} from "@nestjs/cqrs";
import {BadRequestException, HttpStatus} from "@nestjs/common";

import {LoggerService} from "../logger/logger.service";

import {AddPlayerCommand} from "./commands/add-player.command";
import {RemovePlayerCommand} from "./commands/remove-player.command";
import {BroadcastDelegate} from "./services/status-updates.service";

@WebSocketGateway()
export class GameGateway implements BroadcastDelegate {
    private static readonly SPECTATORS = "spectators";

    @WebSocketServer() private server: Server;

    constructor (
        private readonly commandBus: CommandBus,
        private readonly loggerService: LoggerService
    ) {}

    broadcastTo (gameId: string, data: unknown) {
        this.server
            .to([this.spectatorOf(gameId), gameId])
            .emit("game/status", data);
    }

    private spectatorOf (gameId: string) {
        return `${gameId}_${GameGateway.SPECTATORS}`;
    }

    @SubscribeMessage("spectator/join")
    private async spectatorJoin (
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: {
            "gameId": string;
        }
    ) {
        socket.join([GameGateway.SPECTATORS, this.spectatorOf(data.gameId)]);
    }

    @SubscribeMessage("player/join")
    private async join (
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: {
            "gameId": string;
            "playerName": string;
        }
    ) {
        socket.join(data.gameId);

        const playerId = crypto.randomUUID();

        try {
            await this.commandBus.execute(new AddPlayerCommand(
                data.gameId,
                playerId,
                data.playerName,
                socket
            ));

            socket.once("disconnecting", () => {
                this.commandBus.execute(new RemovePlayerCommand(data.gameId, playerId));
            });

            return {
                "status": HttpStatus.OK
            };
        } catch (error) {
            this.loggerService.error(error.message, error.stack, "Player");

            return new BadRequestException(error.message);
        }
    }
}
