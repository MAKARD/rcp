import {CommandBus} from "../shared/command.bus";
import {EventBus} from "../shared/event.bus";
import {SocketBus} from "../shared/socket.bus";

import {GameController} from "./game.controller";

const gameController = new GameController();

EventBus.sharedInstance.on("game/countdown:tick", (gameId, timeLeft) => {
    console.log("Starting", gameId, "in", timeLeft, "sec");
    SocketBus.sharedInstance.to(gameId).emit("game/countdown:tick", timeLeft);
});

EventBus.sharedInstance.on("game/ended", (gameId, winnerId) => {
    if (!winnerId) {
        console.log("Game", gameId, "ends with no winner");
        SocketBus.sharedInstance.to(gameId).emit("game/ended");

        return;
    }

    const player = gameController.getPlayer(winnerId);

    console.log("Game", gameId, "ends with winner", player.name, "by", player.currentHand);
    SocketBus.sharedInstance.to(gameId).emit("game/ended", player.id);
});

EventBus.sharedInstance.on("game/round:drawn", (gameId, playersIdInRound) => {
    const players = playersIdInRound.map((playerId) => gameController.getPlayer(playerId).name);

    console.log("Game", gameId, "ends with no winner. Players in round", players);
    SocketBus.sharedInstance.to(gameId).emit("game/round:drawn", players);
});

EventBus.sharedInstance.on("game/round:started", (gameId, playersIdInRound) => {
    const players = playersIdInRound.map((playerId) => gameController.getPlayer(playerId).name);

    console.log("Starting round with", players);
    SocketBus.sharedInstance.to(gameId).emit("game/round:started", players);
});

EventBus.sharedInstance.on("game/start:allowed", (gameId) => {
    console.log("Game", gameId, "is allowed to start");

    gameController.startTimer(gameId);
});

EventBus.sharedInstance.on("game/start:denied", (gameId) => {
    console.log("Game", gameId, "is not allowed to start");
    SocketBus.sharedInstance.to(gameId).emit("game/start:denied");

    gameController.stopTimerIfNeeded();
});

CommandBus.sharedInstance.bind("game/players:hand:request", (gameId: string) => {
    gameController.requestPlayersHands(gameId);
});

CommandBus.sharedInstance.bind("game/create", (gameId) => {
    gameController.createGame(gameId);

    console.log("Game", gameId, "created");
});
