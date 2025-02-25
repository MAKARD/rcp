import {CommandBus} from "@nestjs/cqrs";
import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";

import {AddPlayerCommand} from "./commands/impl/add-player.command";
import {MoveSpectatorToPlayersCommand} from "./commands/impl/move-spectator-to-players.command";
import {RemovePlayerCommand} from "./commands/impl/remove-player.command";

// "game/start:denied": () => void;
// "game/countdown:tick": (timeLeft: number) => void;
// "game/round:started": (playersIdInRound: Array<string>) => void;
// "game/round:drawn": (playersIdInRound: Array<string>) => void;
// "game/ended": (winnerId?: string) => void;
@WebSocketGateway()
export class GameGateway {
    @WebSocketServer() private server: Server;

    constructor (
        private readonly commandBus: CommandBus
    ) {}

    @SubscribeMessage("player/join")
    async join (
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: {
            "gameId": string;
            "playerName": string;
        }
    ) {
        socket.join(data.gameId);

        this.commandBus.execute(new AddPlayerCommand(data.gameId, socket.id, data.playerName));
    }

    @SubscribeMessage("player/status:move-to-players")
    moveToPlayers (@ConnectedSocket() socket: Socket) {
        this.commandBus.execute(new MoveSpectatorToPlayersCommand(socket.id));
    }

    handleConnection (socket: Socket) {
        socket.on("disconnecting", () => {
            const gameId = [...socket.rooms].at(-1) || "unknown game id";

            this.commandBus.execute(new RemovePlayerCommand(socket.id, gameId));
            socket.leave(gameId);
        });
    }

    async emitHandRequestWithAcknowledge (gameId: string, acknowledge: (playerId: string, hand: string) => void) {
        (await this.server.in(gameId).fetchSockets()).forEach((socket) => {
            socket.emit("player/hand:request", (hand: string) => {
                acknowledge(socket.id, hand);
            });
        });
    }

    emiStartDenied () {
        // this.server.to().emit
    }

    emitCountdownTick (timeLeft: number) {

    }

    emitRoundStarted (playersIdInRound: Array<string>) {

    }

    emitRoundDrawn (playersIdInRound: Array<string>) {

    }

    emitGameEnded (winnerId?: string) {

    }
}
