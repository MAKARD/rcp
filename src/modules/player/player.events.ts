import {CommandBus} from "../shared/command.bus";
import {EventBus} from "../shared/event.bus";
import {SocketBus} from "../shared/socket.bus";

import {PlayerController} from "./player.controller";

const playerController = new PlayerController();

CommandBus.sharedInstance.bind("player/join", (gameId, connectionId, playerName) => {
    console.log("Joining", playerName, "to", gameId);

    playerController.joinSession(gameId, connectionId, playerName);
});

EventBus.sharedInstance.on("player/joined", (gameId, playerId) => {
    const player = playerController.getPlayerById(playerId);

    console.log("Player", player.name, "has joined the game");
    SocketBus.sharedInstance.to(gameId).emit("player/joined", player.name);
});

EventBus.sharedInstance.on("player/left", (gameId, playerId) => {
    const player = playerController.leaveGame(gameId, playerId);

    console.log("Player", player.name, "has left the game");
    SocketBus.sharedInstance.to(gameId).emit("player/left", player.name);
});

EventBus.sharedInstance.on("player/not-joined", async (connectionId, playerName) => {
    console.log("Player", playerName, "was not able to join the game");

    (await SocketBus.sharedInstance.sockets.fetchSockets())
        .find((socket) => socket.id === connectionId)
        ?.emit("player/not-joined", playerName);
});

CommandBus.sharedInstance.bind("player/status:move-to-players", (gameId, playerId) => {
    const player = playerController.makeSpectatorPlayer(playerId);

    console.log("Spectator", player.name, "became a player");
});

CommandBus.sharedInstance.bind("player/status:move-to-spectators", (gameId, playerId) => {
    const player = playerController.makePlayerSpectator(playerId);

    console.log("Player", player.name, "moved to spectators");
    SocketBus.sharedInstance.to(gameId).emit("player/status:moved-to-spectators", player.id, player.name);
});

CommandBus.sharedInstance.bind("player/hand:set", (gameId, playerId, hand) => {
    const player = playerController.getPlayerById(playerId);

    console.log("Player", player.name, "sets", hand);

    try {
        playerController.setPlayerHand(playerId, hand);
    } catch (error) {
        console.log("Player", player.name, "cannot set", hand, "hand", error.message);
    }
});
