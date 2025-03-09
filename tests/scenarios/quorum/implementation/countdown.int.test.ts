import {defineFeature, loadFeature} from "jest-cucumber";

import {gameCreator} from "../../../hooks/game-creator.hook";
import {gameSpectator} from "../../../hooks/game-spectator.hook";
import {ConnectedPlayer, joinGame} from "../../../actions/join-game.action";

const feature = loadFeature("tests/scenarios/quorum/features/countdown.feature");

defineFeature(feature, (test) => {
    test("Reaching starting quorum: player joined", ({
        given,
        when,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        given("At most one player is in a game", async () => {
            await joinGame(game.id.getValue(), "test player 1");
        });

        when("A player joins the game", async () => {
            await joinGame(game.id.getValue(), "test player 2");
        });

        then("The game starts counting down", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "timer_tick");

            expect(data.event.gameId).toBe(game.id.getValue());
            expect(data.event.timeLeft).toBe(5);
        });
    });

    test("Losing starting quorum", ({
        given,
        and,
        when,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        let playerOne: ConnectedPlayer;

        given("At most two players are in a game", async () => {
            playerOne = await joinGame(game.id.getValue(), "test player 1");
            await joinGame(game.id.getValue(), "test player 2");
        });

        and("The game is counting down before the start", async () => {
            await spectator.waitForStatus(({status}) => status === "timer_tick");
        });

        when("A player leaves the game", () => {
            playerOne.disconnect();
        });

        then("The game stops counting down", async () => {
            await spectator.waitForStatus(({status}) => status === "game_is_denied_to_start");
        });
    });

    test("Maintaining starting quorum: player left", ({
        given,
        and,
        when,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        let playerOne: ConnectedPlayer;

        given("At least three players are in a game", async () => {
            playerOne = await joinGame(game.id.getValue(), "test player 1");
            await joinGame(game.id.getValue(), "test player 2");
            await joinGame(game.id.getValue(), "test player 3");
        });

        and("The game is counting down before the start", async () => {
            await spectator.waitForStatus(({status}) => status === "timer_tick");
        });

        when("A player leaves the game", async () => {
            playerOne.disconnect();

            await spectator.waitForStatus(({status}) => status === "player_removed");
        });

        then("The game continues counting down", async () => {
            await spectator.waitForStatus(({status}) => status === "timer_tick");
        });
    });

    test("Maintaining starting quorum: player joined", ({
        given,
        and,
        when,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        given("At least two players are in a game", async () => {
            await joinGame(game.id.getValue(), "test player 1");
            await joinGame(game.id.getValue(), "test player 2");
        });

        and("The game is counting down before the start", async () => {
            await spectator.waitForStatus(({status}) => status === "timer_tick");
        });

        when("A player joins the game", async () => {
            await joinGame(game.id.getValue(), "test player 3");
        });

        then("The game continues counting down", async () => {
            await spectator.waitForStatus(({status}) => status === "timer_tick");
        });
    });
});
