// // eslint-disable-next-line n/no-unsupported-features/node-builtins
// import readline from "readline/promises";
// import Process from "node:process";

// import {io, Socket} from "socket.io-client";

// import {PlayerJSON as PlayerData} from "./entities/Player";
// import {NetworkEvents} from "./networkEvents";
// // import {NetworkEvents} from "./networkEvents";

// const cmdReadLine = readline.createInterface({
//     "input": process.stdin,
//     "output": process.stdout
// });

// let sharedAbortController = new AbortController();

// const cancelableQuestion = async (question: string) => {
//     sharedAbortController.abort();

//     const abortController = new AbortController();

//     sharedAbortController = abortController;

//     try {
//         const response = await cmdReadLine.question(question, {
//             "signal": abortController.signal
//         });

//         return response;
//     } catch (error) {
//         if (abortController.signal.aborted) {
//             console.log("Request", `"${question}"`, "is cancelled");

//             return;
//         }

//         throw error;
//     }
// };

// (async () => {
//     const socket = io("http://localhost:3000") as Socket<NetworkEvents>;

//     const player: PlayerData = {
//         "id": Date.now().toString(),
//         "name": "player " + Date.now().toString()
//     };
//     const sessionId: string = "test";
//     let isJoined = false;

//     while (!isJoined) {
//         // sessionId = await cmdReadLine.question("Enter session id ");
//         // const userId = await cmdReadLine.question("Enter user id ");
//         // const userName = await cmdReadLine.question("Enter user name ");

//         // player.id = userId;
//         // player.name = userName;

//         await new Promise<void>((resolve) => {
//             console.log(`Joining ${sessionId} session`);

//             socket.emit("network/player:join", sessionId, player);

//             socket.once("network/player:joined", () => {
//                 console.log(`Joined ${sessionId} session`);

//                 isJoined = true;

//                 resolve();
//             });

//             socket.once("network/player:not-joined", () => {
//                 console.log(`Unable to join ${sessionId} session`);

//                 resolve();
//             });
//         });
//     }

//     socket.on("network/player:joined", (playerData) => {
//         console.log(`${playerData.name} joined session`);
//     });

//     socket.on("network/player:left", (playerData) => {
//         console.log(`${playerData.name} left session`);
//     });

//     socket.on("network/player:moved-to-spectators", async (playerData) => {
//         console.log(`${playerData.name} Moved to spectators`);

//         if (playerData.id !== player.id) {
//             return;
//         }

//         const response = await cancelableQuestion("Do you want to join the next game as player? (y/n)");

//         if (response === undefined) {
//             return;
//         }

//         if (response === "y") {
//             socket.emit("network/player:move-to-players", sessionId);
//         }
//     });

//     socket.on("network/player:hand-request", async (callback) => {
//         console.log("Asking player", player.name, "for hand");

//         const response = await cancelableQuestion(`Player ${player?.name} sets his hand:`);

//         if (response === undefined) {
//             return;
//         }

//         console.log("Sending player", player.name, "hand response", response);

//         callback(response);
//     });

//     socket.on("network/player:invalid-hand", async () => {
//         console.log("Invalid hand given by", player.name);
//     });

//     socket.on("network/game:round:started", (playersInGame) => {
//         console.log("Starting round with", playersInGame.map((playerInGame) => playerInGame.name));
//     });

//     socket.on("network/game:round:draw", () => {
//         console.log("Round ended as draw");
//     });

//     socket.on("network/game:ended", async (winner) => {
//         if (winner) {
//             console.log("Game is over, the winner is", winner.name);
//         } else {
//             sharedAbortController.abort();

//             console.log("Game is stopped");
//         }
//     });

//     socket.on("network/game:countdown", (timeLeft) => {
//         console.log("Starting game in", timeLeft, "seconds");
//     });

//     socket.on("network/game:waiting", () => {
//         console.log("Waiting players to join...");
//     });

//     socket.on("disconnect", (reason) => {
//         console.log("Disconnected", reason);

//         Process.exit();
//     });
// })();
