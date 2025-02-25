// eslint-disable-next-line n/no-unsupported-features/node-builtins
import * as readline from "readline/promises";
import * as Process from "node:process";

import {io, Socket} from "socket.io-client";

import {NetworkEvents} from "./networkEvents";

const cmdReadLine = readline.createInterface({
    "input": process.stdin,
    "output": process.stdout
});

let sharedAbortController = new AbortController();

const cancelableQuestion = async (question: string) => {
    sharedAbortController.abort();

    const abortController = new AbortController();

    sharedAbortController = abortController;

    try {
        const response = await cmdReadLine.question(question, {
            "signal": abortController.signal
        });

        return response;
    } catch (error) {
        if (abortController.signal.aborted) {
            console.log("Request", `"${question}"`, "is cancelled");

            return;
        }

        throw error;
    }
};

(async () => {
    const socket = io("http://localhost:3000") as Socket<NetworkEvents>;

    const player = {
        "name": "player " + Date.now().toString()
    };
    const sessionId: string = "test";
    const isJoined = false;

    // while (!isJoined) {
    // sessionId = await cmdReadLine.question("Enter session id ");
    // const userId = await cmdReadLine.question("Enter user id ");
    // const userName = await cmdReadLine.question("Enter user name ");

    // player.id = userId;
    // player.name = userName;

    await new Promise<void>((resolve) => {
        console.log(`Joining ${sessionId} session`);

        (socket.emit as any)("player/join", {
            "gameId": sessionId,
            "playerName": player.name
        });

        resolve();

        // socket.once("player/joined", () => {
        //     console.log(`Joined ${sessionId} session`);

        //     isJoined = true;

        //     resolve();
        // });

        // socket.once("player/not-joined", () => {
        //     console.log(`Unable to join ${sessionId} session`);

        //     resolve();
        // });
    });
    // }

    socket.on("player/joined", (playerName) => {
        console.log(`${playerName} joined session`);
    });

    socket.on("player/left", (playerName) => {
        console.log(`${playerName} left session`);
    });

    socket.on("player/status:moved-to-spectators", async (playerId, playerName) => {
        console.log(`${playerName} Moved to spectators`);

        if (socket.id !== playerId) {
            return;
        }

        const response = await cancelableQuestion("Do you want to join the next game as player? (y/n)");

        if (response === undefined) {
            return;
        }

        if (response === "y") {
            socket.emit("player/status:move-to-players", sessionId);
        }
    });

    socket.on("player/hand:request", async (callback) => {
        console.log("Asking player", player.name, "for hand");

        const response = await cancelableQuestion(`Player ${player?.name} sets his hand:`);

        if (response === undefined) {
            return;
        }

        console.log("Sending player", player.name, "hand response", response);

        callback(response);
    });

    socket.on("game/round:started", (playersInGame) => {
        console.log("Starting round with", playersInGame);
    });

    socket.on("game/round:drawn", (playersInGame) => {
        console.log("Round ended as draw", playersInGame);
    });

    socket.on("game/ended", async (winnerName) => {
        if (winnerName) {
            console.log("Game is over, the winner is", winnerName);
        } else {
            sharedAbortController.abort();

            console.log("Game is stopped");
        }
    });

    socket.on("game/countdown:tick", (timeLeft) => {
        console.log("Starting game in", timeLeft, "seconds");
    });

    socket.on("game/start:denied", () => {
        console.log("Waiting players to join...");
    });

    socket.on("disconnect", (reason) => {
        console.log("Disconnected", reason);

        Process.exit();
    });
})();
