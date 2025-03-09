import {defineFeature, loadFeature} from "jest-cucumber";
import {io} from "socket.io-client";

import {gameCreator} from "../../../hooks/game-creator.hook";
import {gameSpectator} from "../../../hooks/game-spectator.hook";
import {joinGame} from "../../../actions/join-game.action";

const feature = loadFeature("tests/scenarios/players/features/joining.feature");

defineFeature(feature, (test) => {
    test("One player", ({
        given,
        when,
        then
    }) => {
        const socket = io("http://localhost:3005", {
            "autoConnect": false
        });

        afterAll(() => {
            socket.disconnect();
        });

        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        given("A player connected to the socket gateway", () => {
            socket.connect();
        });

        when("The player emits the 'player/join' event", () => {
            socket.emit("player/join", {
                "gameId": game.id.getValue(),
                "playerName": "test player 1 (one player)"
            });
        });

        then("The player joins the game they passed in params", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "player_added");

            expect(data.event.gameId).toBe(game.id.getValue());
            expect(data.event.player.name).toBe("test player 1 (one player)");
        });
    });

    test("N+1 players", ({
        given,
        and,
        when,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        const socket = io("http://localhost:3005", {
            "autoConnect": false
        });

        afterAll(() => {
            socket.disconnect();
        });

        given("At least one player is already in a game", async () => {
            await joinGame(game.id.getValue(), "test player 1");
        });

        and("A player connected to the socket gateway", () => {
            socket.connect();
        });

        when("The player emits the 'player/join' event", async () => {
            socket.emit("player/join", {
                "gameId": game.id.getValue(),
                "playerName": "test player 2"
            });
        });

        then("The player joins the game they passed in params", async () => {
            await spectator
                .waitForStatus(
                    ({event, status}) => event.player?.name === "test player 2" && status === "player_added"
                );
        });
    });
});
