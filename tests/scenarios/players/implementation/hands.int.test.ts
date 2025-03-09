import {defineFeature, loadFeature} from "jest-cucumber";
import waitForExpect from "wait-for-expect";

import {gameCreator} from "../../../hooks/game-creator.hook";
import {gameSpectator} from "../../../hooks/game-spectator.hook";
import {ConnectedPlayer, joinGame} from "../../../actions/join-game.action";
import {fastForwardTimer} from "../../../actions/fast-forward-timer.action";

const feature = loadFeature("tests/scenarios/players/features/hands.feature");

defineFeature(feature, (test) => {
    test("Asking players for their hands", ({
        given,
        when,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        let playerOne: ConnectedPlayer;
        let playerTwo: ConnectedPlayer;

        given("At least two players are in an active game", async () => {
            playerOne = await joinGame(game.id.getValue(), "test player 1");
            playerTwo = await joinGame(game.id.getValue(), "test player 2");
        });

        when("The next round starts", async () => {
            await fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        then("All joined players are asked for their hand", async () => {
            await Promise.all([
                waitForExpect(() => expect(playerOne.handRequestListener).toHaveBeenCalledOnce()),
                waitForExpect(() => expect(playerTwo.handRequestListener).toHaveBeenCalledOnce())
            ]);
        });
    });

    test("Invalid response", ({
        given,
        when,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        let playerOne: ConnectedPlayer;
        let playerTwo: ConnectedPlayer;

        given("At least two players are in an active game", async () => {
            playerOne = await joinGame(game.id.getValue(), "test player 1");
            playerTwo = await joinGame(game.id.getValue(), "test player 2");

            await fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        when("A player responds with a hand other than 'paper', 'rock', or 'scissors'", async () => {
            playerOne.respondWithHand("kek");

            await spectator.waitForStatus(({status}) => status === "invalid_hand");
        });

        then("The player still has the ability to respond with a hand", async () => {
            await waitForExpect(() => expect(playerOne.handRequestListener).toHaveBeenCalledTimes(2));

            playerOne.respondWithHand("paper");
            playerTwo.respondWithHand("rock");

            const data = await spectator.waitForStatus(({status}) => status === "game_ended_with_winner");

            expect(data.event.gameId).toBe(game.id.getValue());
            expect(data.event.winner.name).toBe("test player 1");
        });
    });

    test("Valid response", ({
        given,
        when,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        let playerOne: ConnectedPlayer;

        given("At least two players are in an active game", async () => {
            playerOne = await joinGame(game.id.getValue(), "test player 1");

            await joinGame(game.id.getValue(), "test player 2");

            await fastForwardTimer(game.id.getValue());
        });

        when("A player responds with 'paper', 'rock', or 'scissors'", () => {
            playerOne.respondWithHand("paper");
        });

        then("The game accepts their response", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "hand_set");

            expect(data.event.gameId).toBe(game.id.getValue());
            expect(data.event.player.name).toBe("test player 1");
        });
    });

    test("No response", ({
        given,
        when,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        let playerOne: ConnectedPlayer;

        given("At least two players are in an active game", async () => {
            playerOne = await joinGame(game.id.getValue(), "test player 1");
            await joinGame(game.id.getValue(), "test player 2");

            await fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        when("A player does not respond within 10 seconds", () => {
            playerOne.fastForwardTimer();
        });

        then("The player is removed from the game", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "player_removed");

            expect(data.event.gameId).toBe(game.id.getValue());
            expect(data.event.player.name).toBe("test player 1");
        });
    });

    test("All set", ({
        given,
        when,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        let playerOne: ConnectedPlayer;
        let playerTwo: ConnectedPlayer;

        given("At least two players are in an active game", async () => {
            playerOne = await joinGame(game.id.getValue(), "test player 1");
            playerTwo = await joinGame(game.id.getValue(), "test player 2");

            await fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        when("All players respond with 'paper', 'rock', or 'scissors'", () => {
            playerOne.respondWithHand("paper");
            playerTwo.respondWithHand("rock");
        });

        then("The game declares the results", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "game_ended_with_winner");

            expect(data.event.gameId).toBe(game.id.getValue());
            expect(data.event.winner.name).toBe("test player 1");
        });
    });
});
