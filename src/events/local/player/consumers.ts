import EventEmitter from "events";

import {Server, Socket} from "socket.io";

import * as External from "../../external";
import {Session} from "../../../entities/Session";
import * as Game from "../game";

import {Events} from "./events";

export function registerGlobalEventConsumers (
    eventEmitter: EventEmitter<Events & Game.Events>,
    server: Server<External.Player.Events>,
    sessions: Map<string, Session>
) {
    const listenerCleaners = new Map<string, () => void>();

    eventEmitter.on("local/player:left", (player) => {
        console.log("player has left the game", player.name);

        listenerCleaners.get(player.id)?.();
        listenerCleaners.delete(player.id);
    });

    eventEmitter.on("local/player:not-joined", (playerData) => {
        console.log("player has not joined the game", playerData.name);
    });

    const executionQueue = new Set<() => void>();
    let timeout: NodeJS.Timeout;

    function scheduleExecutionWorkaround (executionFunction: () => void) {
        executionQueue.add(executionFunction);

        clearTimeout(timeout);

        // eslint-disable-next-line no-restricted-globals
        timeout = setTimeout(() => {
            executionQueue.forEach((item) => item());

            executionQueue.clear();
        }, 0);
    }

    return function registerScopedEventConsumers (socket: Socket<External.Player.Events>) {
        const playerJoinedListener: (...args: Events["local/player:joined"]) => void = (sessionId, player) => {
            const session = sessions.get(sessionId);

            if (!session) {
                console.log("Unable to find", sessionId, "session");

                return;
            }

            console.log("player has joined the game", player.name);

            const handRequestListener = () => {
                console.log("Waiting for hand of player", player.name);

                let gameIsEnded = false;
                eventEmitter.once("local/game:ended", () => {
                    gameIsEnded = true;
                });

                eventEmitter.once("local/game:round:draw", () => {
                    gameIsEnded = false;
                });

                socket.timeout(10000).emit("network/player:hand-request", (timeoutError, hand) => {
                    if (!socket.connected || gameIsEnded) {
                        return;
                    }

                    if (timeoutError) {
                        console.log("Player", player.name, "moved to spectators because of timeout");

                        scheduleExecutionWorkaround(() => {
                            player.isSpectator = true;

                            server.to(sessionId).emit("network/player:moved-to-spectators", player);
                        });

                        return;
                    }

                    console.log("Player", player.name, "selected", hand);

                    try {
                        player.currentHand = hand;
                    } catch (error) {
                        socket.emit("network/player:invalid-hand");

                        console.log("Player", player.name, "selected invalid hand", error.message);
                    }
                });
            };

            session.gameEvents.addListener("onRequestPlayersHand", handRequestListener);

            listenerCleaners.set(
                player.id,
                () => session.gameEvents.removeListener("onRequestPlayersHand", handRequestListener)
            );
        };

        eventEmitter.once("local/player:joined", playerJoinedListener);

        return function unregisterScopedEventConsumers () {};

    };
}
