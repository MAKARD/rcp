// eslint-disable-next-line n/no-unsupported-features/node-builtins
import readline from "readline/promises";
import EventEmitter from "node:events";

import {Game} from "./Game";
import {Player} from "./Player";

const cmdReadLine = readline.createInterface({
    "input": process.stdin,
    "output": process.stdout
});

const events = new EventEmitter<{
    "players:ready": [];
}>();
const players: Array<Player> = [];

(async () => {
    let numberOfPlayers = NaN;
    while (numberOfPlayers <= 1 || Number.isNaN(numberOfPlayers)) {
        numberOfPlayers = Number(await cmdReadLine.question("Enter number of players "));
    }

    for (let i = 1; i <= numberOfPlayers; i++) {
        let name = "";
        while (!name) {
            name = await cmdReadLine.question(`Enter player ${i} name `);
        }

        players.push(new Player(name));
    }

    events.emit("players:ready");
})();

const game = new Game(
    players as [Player, Player],
    (playerName) => {
        return cmdReadLine.question(`player ${playerName} sets his hand:`);
    }
);

game.addListener("onDraw", () => {
    console.log("Draw - next round with the same audience");
});

game.addListener("onWin", (winner) => {
    console.log(`Winner - ${winner.name} by ${winner.currentHand}`);
});

game.addListener("onNextRound", (playersInGame) => {
    console.log(`Next round with ${playersInGame.map(({name}) => name).join(", ")}`);
});

game.addListener("onInvalidHandProvided", (handName, playerName) => {
    console.log(`${handName} is an invalid choice, ${playerName} should retry`);
});

game.addListener("onEnd", () => {
    cmdReadLine.close();
});

events.on("players:ready", () => {
    game.play();
});
