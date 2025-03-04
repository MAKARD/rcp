import {defineFeature, loadFeature} from "jest-cucumber";
import {io} from "socket.io-client";

import {joinGame} from "../../../actions";
import {gameCreator, gameSpectator} from "../../../hooks";

const feature = loadFeature("tests/scenarios/players/features/joining.feature");

defineFeature(feature, test => {

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

            expect(data.message).toBe(`Player test player 1 (one player) added to ${game.id.getValue()}`);
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
            await joinGame(game.id.getValue(), "test player 1", spectator);
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
                .waitForStatus(({message}) => message === `Player test player 2 added to ${game.id.getValue()}`);
        });
    });
});
