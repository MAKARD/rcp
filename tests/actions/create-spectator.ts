import {EventEmitter} from "node:events";
import * as crypto from "crypto";

import {io, Socket} from "socket.io-client";

export interface CreatedSpectator {
    "disconnect": () => void;
    "waitForStatus": (statusMatcher: (data: Record<string, string>) => boolean) => Promise<Record<string, string>>;
}

// eslint-disable-next-line no-restricted-globals
const delay = () => new Promise<void>((resolve) => setTimeout(resolve, 1));

export async function createSpectator (gameId: string): Promise<CreatedSpectator> {
    let spectator: Socket | undefined;

    const id = crypto.randomUUID();

    const statusQueue: Array<Record<string, string>> = [];

    const eventEmitter = new EventEmitter();

    await new Promise<void>((resolve) => {
        spectator = io("http://localhost:3005");

        spectator.emit("spectator/join", {
            gameId
        });

        spectator.on("game/status", (data: Record<string, string>) => {
            statusQueue.push(data);

            eventEmitter.emit("push");
        });

        resolve();
    });

    return {
        "disconnect": () => {
            spectator?.disconnect();
            spectator?.removeAllListeners();
        },
        "waitForStatus": async (statusMatcher) => {
            let matchResult: Record<string, string> | undefined;

            const prev = Date.now();

            while (!matchResult) {
                await delay();

                if (!statusQueue.length) {
                    await new Promise<void>((resolve) => {
                        if (statusQueue.length) {
                            resolve();

                            return;
                        }

                        eventEmitter.once("push", resolve);
                    });
                }

                const data = statusQueue.shift();

                if (!data) {
                    continue;
                }

                if (statusMatcher(data)) {
                    matchResult = data;
                }
            }

            return matchResult;
        }
    };
}
