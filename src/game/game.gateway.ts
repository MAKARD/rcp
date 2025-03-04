import {CommandBus} from "@nestjs/cqrs";
import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {asapScheduler, concatMap, debounce, debounceTime, delay, delayWhen, filter, fromEvent, interval, map, of, pairwise, queueScheduler, scan, startWith, Subject, throttleTime, timeout, timer, timestamp} from "rxjs";

import {AddPlayerCommand} from "./commands/impl/add-player.command";
import {RemovePlayerCommand} from "./commands/impl/remove-player.command";

// "game/start:denied": () => void;
// "game/countdown:tick": (timeLeft: number) => void;
// "game/round:started": (playersIdInRound: Array<string>) => void;
// "game/round:drawn": (playersIdInRound: Array<string>) => void;
// "game/ended": (winnerId?: string) => void;
const SPECTATORS = "spectators";

interface StatusUpdate {
    "gameId": string;
    "data": Record<string, string>;
}

// TODO sort out STatusUpdates interface
// TODO consider moving delay logic to common
// TODO sort out spectators getter
// TODO reconsider RequestPlayersHandsHandler socket logic
@WebSocketGateway()
export class GameGateway {
    @WebSocketServer() private server: Server;

    private statusUpdatesQueue: Array<StatusUpdate> = [];

    private statusUpdates = new Subject<StatusUpdate>();

    constructor (
        private readonly commandBus: CommandBus
    ) {
        // interval(100)
        //     .pipe(
        //         filter(() => !!this.statusUpdatesQueue.length)
        //     )
        //     .subscribe(() => {
        //         const event = this.statusUpdatesQueue.shift();

        //         if (!event) {
        //             return;
        //         }

        //         this.server
        //             .to([`${event.gameId}_${SPECTATORS}`, event.gameId])
        //             .emit("game/status", event.data);

        //     });
        // let lastUpdate = Date.now();
        // 100 ok
        // 50 ok
        // 10

        let isRunning = false;

        const scheduler = {
            "run": async () => {
                if (isRunning) {
                    return;
                }

                isRunning = true;

                let event = this.statusUpdatesQueue.shift();

                while (event) {
                    // TODO: fix doubled event game denied and mb write tests for that
                    this.server
                        .to([`${event.gameId}_${SPECTATORS}`, event.gameId])
                        .emit("game/status", event.data);

                    await new Promise((resolve) => setTimeout(resolve, 10));

                    event = this.statusUpdatesQueue.shift();
                }

                isRunning = false;

            }
        };

        this.statusUpdates
            .subscribe(async ({gameId, data}) => {
                this.statusUpdatesQueue.push({
                    gameId,
                    data
                });

                scheduler.run();

                // const event = this.statusUpdatesQueue.shift();

                // const diffMs = lastUpdate - Date.now();

                // if (diffMs < 100) {
                //     await new Promise((resolve) => setTimeout(resolve, 100 - diffMs));
                // }

                // lastUpdate = Date.now();

                // this.server
                //     .to([`${gameId}_${SPECTATORS}`, gameId])
                //     .emit("game/status", data);
            });
    }

    @SubscribeMessage("spectator/join")
    async spectatorJoin (
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: {
            "gameId": string;
        }
    ) {
        socket.join([SPECTATORS, `${data.gameId}_${SPECTATORS}`]);
    }

    @SubscribeMessage("player/join")
    async join (
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: {
            "gameId": string;
            "playerName": string;
        }
    ) {
        socket.join(data.gameId);

        console.log("join", socket.id, "to", data.gameId);

        this.commandBus.execute(new AddPlayerCommand(data.gameId, socket.id, data.playerName));
    }

    handleConnection (socket: Socket) {

        socket.on("disconnecting", async () => {
            if (socket.rooms.has(SPECTATORS)) {
                return;
            }

            const gameId = [...socket.rooms].at(-1) || "unknown game id";

            // TODO: reconsider this check and socket id usage in overall
            try {
                await this.commandBus.execute(new RemovePlayerCommand(socket.id, gameId));
            } catch {
                //..
            }
        });
    }

    getConnectedClientsInGame (gameId: string) {
        return this.server
            .in(gameId)
            .fetchSockets();
    }

    broadcastStatusWithinGame (gameId: string, data: Record<string, string>) {
        this.statusUpdates.next({
            gameId,
            data
        });

        // this.statusUpdatesQueue.push({
        //     gameId,
        //     data
        // });
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
