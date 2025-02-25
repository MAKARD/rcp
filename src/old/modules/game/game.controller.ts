import {GameEvents} from "../../entities/Game";
import {CommandBus} from "../shared/command.bus";
import {EventBus} from "../shared/event.bus";
import {GamesService} from "../shared/games.service";
import {PlayersService} from "../shared/player.service";
import {SocketBus} from "../shared/socket.bus";

import {CountdownController} from "./countdown.controller";

export class GameController {
    private countdownController = new CountdownController();

    public stopTimerIfNeeded () {
        this.countdownController.reset();
    }

    public startTimer (gameId: string) {
        const game = GamesService.sharedInstance.getById(gameId);

        if (this.countdownController.isRunning()) {
            return;
        }

        this.countdownController.run((timeLeft) => {
            if (timeLeft === 0) {
                game.play()
                    .catch(() => {
                        // console.log("Game error", error);
                    });
            } else {
                EventBus.sharedInstance.emit("game/countdown:tick", gameId, timeLeft);
            }

        });
    }

    public getPlayer (playerId: string) {
        const player = PlayersService.sharedInstance.getById(playerId);

        return player;
    }

    public async requestPlayersHands (gameId: string) {
        const sockets = await SocketBus.sharedInstance.in(gameId).fetchSockets();

        sockets.forEach((socket) => {
            socket.timeout(10000).emit("player/hand:request", ((timeoutError: Error, hand: string) => {
                if (timeoutError) {
                    CommandBus.sharedInstance.execute("player/status:move-to-spectators", gameId, socket.id);

                    return;
                }

                CommandBus.sharedInstance.execute("player/hand:set", gameId, socket.id, hand);
            // Workaround for confusing typings of socket.io
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any);
        });
    }

    public createGame (gameId: string) {
        const gameEvents = new GameEvents();

        GamesService.sharedInstance.create(gameId, gameEvents);

        gameEvents.addListener("onDraw", (playersInGame) => {
            EventBus.sharedInstance.emit(
                "game/round:drawn",
                gameId,
                playersInGame.map((player) => player.id)
            );
        });

        gameEvents.addListener("onWin", (winner) => {
            EventBus.sharedInstance.emit(
                "game/ended",
                gameId,
                winner.id
            );
        });

        gameEvents.addListener("onRequestPlayersHand", () => {
            CommandBus.sharedInstance.execute("game/players:hand:request", gameId);
        });

        gameEvents.addListener("onNoPlayersLeft", () => {
            EventBus.sharedInstance.emit("game/ended", gameId);
        });

        gameEvents.addListener("onRound", (playersInGame) => {
            EventBus.sharedInstance.emit(
                "game/round:started",
                gameId,
                playersInGame.map((player) => player.id)
            );
        });

        gameEvents.addListener("onAllowanceToStartStatusChange", (status) => {
            if (status) {
                EventBus.sharedInstance.emit("game/start:allowed", gameId);
            } else {
                EventBus.sharedInstance.emit("game/start:denied", gameId);
            }
        });
    }
}
