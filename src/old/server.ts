// import crypto from "crypto";
import http from "http";

import express from "express";

import "./modules/game/game.events";
import "./modules/player/player.events";

import {SocketBus} from "./modules/shared/socket.bus";
import {EventBus} from "./modules/shared/event.bus";
import {CommandBus} from "./modules/shared/command.bus";

// TODO: Add socket bus events

// TODO: get rid of rooms in favor of namespaces
// TODO: logging system with saving to file storage
// TODO: remove game after inactivity time

const app = express();

const server = http.createServer(app);

SocketBus.init(server);

const PORT = 3000;

// eslint-disable-next-line no-restricted-globals
setTimeout(() => {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    fetch("http://localhost:3000/session", {
        "method": "POST"
    });
}, 1000);

app.post("/session", (_, res) => {
    // const id = crypto.randomUUID();
    const id = "test";

    CommandBus.sharedInstance.execute("game/create", id);

    res
        .status(200)
        .send({
            id
        });
});

SocketBus.sharedInstance.on("connection", (socket) => {
    console.log("Connect client", socket.id);

    socket.on("player/join", (gameId, playerName) => {
        socket.join(gameId);

        CommandBus.sharedInstance.execute("player/join", gameId, socket.id, playerName);
    });

    socket.on("player/status:move-to-players", (gameId) => {
        CommandBus.sharedInstance.execute("player/status:move-to-players", gameId, socket.id);
    });

    socket.on("disconnecting", (reason) => {
        console.log("Disconnecting client", socket.id, reason);

        const gameId = [...socket.rooms].at(-1) || "unknown game id";

        socket.leave(gameId);

        EventBus.sharedInstance.emit("player/left", gameId, socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
