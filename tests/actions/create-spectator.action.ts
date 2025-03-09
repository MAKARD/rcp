import {EventEmitter} from "node:events";

import {io, Socket} from "socket.io-client";

interface Data {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface CreatedSpectator {
    "disconnect": () => void;
    "waitForStatus": (statusMatcher: (data: Data) => boolean) => Promise<Data>;
}

// eslint-disable-next-line no-restricted-globals
const delay = () => new Promise<void>((resolve) => setTimeout(resolve, 1));

export async function createSpectator (gameId: string): Promise<CreatedSpectator> {
    let spectator: Socket | undefined;

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

            while (!matchResult) {
                await delay();

                if (!statusQueue.length) {
                    await new Promise<void>((resolve) => {
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
