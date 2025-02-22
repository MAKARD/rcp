
// import crypto from "crypto";
import http from "http";
import EventEmitter from "events";

import express from "express";
import {Server} from "socket.io";

import {Session} from "./entities/Session";
import * as Events from "./events";

// TODO: reconsider event driven development approach

// TODO: get rid of rooms in favor of namespaces
// TODO: logging system with saving to file storage
// TODO: remove session after inactivity time
// TODO: make events factory

const app = express();

const server = http.createServer(app);

const io = new Server<Events.AllExternalEvents, Events.AllExternalEvents, Events.AllExternalEvents>(server);

const PORT = 3000;

const sessions = new Map<string, Session>();

// const registerGameHandler = createGameHandler(sessions);

// eslint-disable-next-line no-restricted-globals
setTimeout(() => {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    fetch("http://localhost:3000/session", {
        "method": "POST"
    });
}, 1000);

const eventEmitter = new EventEmitter<Events.AllLocalEvents>();

app.post("/session", (_, res) => {
    // const id = crypto.randomUUID();
    const id = "test";

    const session = new Session(id);

    session.gameEvents.addListener("onDraw", (playersInGame) => {
        console.log("Received 'onDraw' signal");

        io.to(id).emit("network/game:round:draw", playersInGame);
        eventEmitter.emit("local/game:round:draw", playersInGame);
    });

    session.gameEvents.addListener("onWin", (winner) => {
        console.log("Received 'onWin' signal");

        io.to(id).emit("network/game:ended", winner);
        eventEmitter.emit("local/game:ended", winner);
    });

    session.gameEvents.addListener("onRound", (playersInGame) => {
        console.log("Received 'onRound' signal");

        io.to(id).emit("network/game:round:started", playersInGame);

        eventEmitter.emit("local/game:round:started", playersInGame);
    });

    session.gameEvents.addListener("onNoPlayersLeft", () => {
        console.log("Received 'onNoPlayersLeft' signal");

        io.to(id).emit("network/game:ended");
        eventEmitter.emit("local/game:ended");
    });

    session.gameEvents.addListener("onAllowanceToStartStatusChange", (status) => {
        if (status) {
            eventEmitter.emit("local/game:request-to-start", id);
        } else {
            eventEmitter.emit("local/game:waiting", id);
        }
    });

    sessions.set(
        id,
        session
    );

    console.log("Session", id, "created");

    res
        .status(200)
        .send({
            id
        });
});

const registerScopedLocalGameEventsConsumers = Events.Local.Game.registerGlobalEventConsumers(
    eventEmitter as EventEmitter<Events.Local.Game.Events>,
    io,
    sessions
);

const registerScopedLocalPlayerEventsConsumers = Events.Local.Player.registerGlobalEventConsumers(
    eventEmitter as EventEmitter<Events.Local.Player.Events>,
    io,
    sessions
);

const registerScopedExternalPlayerEventsConsumers = Events.External.Player.registerGlobalEventConsumers(
    io,
    eventEmitter,
    sessions
);

const registerScopedExternalGameEventsConsumers = Events.External.Game.registerGlobalEventConsumers(
    io
);

io.on("connection", (socket) => {
    console.log("Connect client", socket.id);

    const unRegisterScopedLocalGameEventsConsumers = registerScopedLocalGameEventsConsumers(socket);
    const unRegisterScopedLocalPlayerEventsConsumers = registerScopedLocalPlayerEventsConsumers(socket);
    const unRegisterScopedExternalPlayerEventsConsumers = registerScopedExternalPlayerEventsConsumers(socket);
    const unRegisterScopedExternalGameEventsConsumers = registerScopedExternalGameEventsConsumers(socket);

    socket.on("disconnecting", (reason) => {
        console.log("Disconnecting client", socket.id, reason);

        unRegisterScopedLocalGameEventsConsumers();
        unRegisterScopedLocalPlayerEventsConsumers();
        unRegisterScopedExternalPlayerEventsConsumers();
        unRegisterScopedExternalGameEventsConsumers();

        const sessionId = [...socket.rooms].at(-1) || "unknown session id";

        const session = sessions.get(sessionId);

        if (!session) {
            console.log("Skipping session cleaning stage. Session", sessionId, "not found");

            return;
        }

        const player = session.getConnectedPlayer(socket.id);

        socket.leave(sessionId);

        if (!player) {
            console.log("Skipping player cleaning stage. Player for connection", socket.id, "not found");

            return;
        }

        session.removeConnectedPlayer(socket.id);

        eventEmitter.emit("local/player:left", player);
        io.to(sessionId).emit("network/player:left", player);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
