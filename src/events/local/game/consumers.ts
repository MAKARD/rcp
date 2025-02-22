import EventEmitter from "events";

import {Server, Socket} from "socket.io";

import {Session} from "../../../entities/Session";
import * as External from "../../external";

import {Events} from "./events";

export function registerGlobalEventConsumers (
    eventEmitter: EventEmitter<Events>,
    server: Server<never, External.Game.Events>,
    sessions: Map<string, Session>
) {
    eventEmitter.on("local/game:countdown", (sessionId, timeLeft) => {
        server.to(sessionId).emit("network/game:countdown", timeLeft);

        console.log("Starting game in", timeLeft, "seconds");
    });

    eventEmitter.on("local/game:waiting", (sessionId) => {
        console.log("Waiting players to join");

        server.to(sessionId).emit("network/game:waiting");
    });

    eventEmitter.on("local/game:ended", (winner) => {
        if (winner) {
            console.log("Game is ended. Winner", winner.name);
        } else {
            console.log("Game is ended. No winner");
        }
    });

    eventEmitter.on("local/game:round:started", (playersInRound) => {
        console.log("Round is started. Players in game", playersInRound.map((player) => player.name));
    });

    eventEmitter.on("local/game:round:draw", (playersInRound) => {
        console.log("Round is ended with draw. Players in round", playersInRound.map((player) => player.name));
    });

    eventEmitter.on("local/game:request-to-start", (sessionId) => {
        const session = sessions.get(sessionId);

        if (!session) {
            console.log("Not started: Unable to find", sessionId, "session");

            return;
        }

        session.initiateStarting((timeLeft) => {
            if (isNaN(timeLeft)) {
                return;
            }

            if (timeLeft > 0) {
                eventEmitter.emit("local/game:countdown", sessionId, timeLeft);
            }
        });
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function registerScopedEventConsumers (socket: Socket) {
        return function unregisterScopedEventConsumers () {};
    };
}
