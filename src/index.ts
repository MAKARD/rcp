// eslint-disable-next-line n/no-unsupported-features/node-builtins
import readline from "readline/promises";

import {Game} from "./Game";
import {Player} from "./Player";

const cmdReadLine = readline.createInterface({
    "input": process.stdin,
    "output": process.stdout
});

const game = new Game(
    [
        new Player("player 1"),
        new Player("player 2")
    ],
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

game.play();
