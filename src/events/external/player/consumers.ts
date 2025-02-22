import EventEmitter from "events";

import {Socket, Server} from "socket.io";

import {Session} from "../../../entities/Session";
import * as Local from "../../local";

import {Events} from "./events";

export function registerGlobalEventConsumers (
    server: Server<never, Events>,
    eventEmitter: EventEmitter<Local.Game.Events & Local.Player.Events>,
    sessions: Map<string, Session>
) {
    return function registerScopedEventConsumers (socket: Socket<Events>) {
        socket.on("network/player:join", (sessionId, playerData) => {
            const session = sessions.get(sessionId);

            if (!session) {
                eventEmitter.emit("local/player:not-joined", playerData);
                socket.emit("network/player:not-joined");

                return;
            }

            socket.join(sessionId);
            const player = session.addConnectedPlayer(socket.id, playerData);

            eventEmitter.emit("local/player:joined", sessionId, player);
            server.to(sessionId).emit("network/player:joined", playerData);
        });

        socket.on("network/player:move-to-players", (sessionId) => {
            const session = sessions.get(sessionId);

            if (!session) {
                console.log("Unable to move spectator to players - session", sessionId, "is not found");

                return;
            }

            const player = session.getConnectedPlayer(socket.id);

            if (!player) {
                console.log("Unable to move spectator to players - connection", socket.id, "is not found");

                return;
            }

            player.isSpectator = false;

        });

        return function unregisterScopedEventConsumers () {};
    };
}
