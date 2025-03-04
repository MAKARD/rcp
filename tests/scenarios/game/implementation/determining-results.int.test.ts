/* eslint-disable max-lines */
import {defineFeature, loadFeature} from "jest-cucumber";

import {gameCreator, gameSpectator} from "../../../hooks";
import {ConnectedPlayer, fastForwardTimer, joinGame} from "../../../actions";

const feature = loadFeature("tests/scenarios/game/features/determining-results.feature");

defineFeature(feature, test => {
    test("Two players: paper vs. rock", ({
        given,
        when,
        and,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        let playerOne: ConnectedPlayer;
        let playerTwo: ConnectedPlayer;

        given("Two players are in an active game", async () => {
            playerOne = await joinGame(game.id.getValue(), "test player 1", spectator);
            playerTwo = await joinGame(game.id.getValue(), "test player 2", spectator);

            fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        when("The first player responds with 'paper'", () => {
            playerOne.respondWithHand("paper");
        });

        and("The second player responds with 'rock'", () => {
            playerTwo.respondWithHand("rock");
        });

        then("The game declares the first player the winner", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "game_ended_with_winner");

            expect(data.message).toBe(`Game ${game.id.getValue()} won by test player 1 with paper`);
        });
    });

    test("Two players: scissors vs. paper", ({
        given,
        when,
        and,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        let playerOne: ConnectedPlayer;
        let playerTwo: ConnectedPlayer;

        given("Two players are in an active game", async () => {
            playerOne = await joinGame(game.id.getValue(), "test player 1", spectator);
            playerTwo = await joinGame(game.id.getValue(), "test player 2", spectator);

            fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        when("The first player responds with 'scissors'", () => {
            playerOne.respondWithHand("scissors");
        });

        and("The second player responds with 'paper'", () => {
            playerTwo.respondWithHand("paper");
        });

        then("The game declares the first player the winner", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "game_ended_with_winner");

            expect(data.message).toBe(`Game ${game.id.getValue()} won by test player 1 with scissors`);
        });
    });

    test("Two players: rock vs. scissors", ({
        given,
        when,
        and,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        let playerOne: ConnectedPlayer;
        let playerTwo: ConnectedPlayer;

        given("Two players are in an active game", async () => {
            playerOne = await joinGame(game.id.getValue(), "test player 1", spectator);
            playerTwo = await joinGame(game.id.getValue(), "test player 2", spectator);

            fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        when("The first player responds with 'rock'", () => {
            playerOne.respondWithHand("rock");
        });

        and("The second player responds with 'scissors'", () => {
            playerTwo.respondWithHand("scissors");
        });

        then("The game declares the first player the winner", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "game_ended_with_winner");

            expect(data.message).toBe(`Game ${game.id.getValue()} won by test player 1 with rock`);
        });
    });

    test("Three players: no winners", ({
        given,
        when,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        let playerOne: ConnectedPlayer;
        let playerTwo: ConnectedPlayer;
        let playerThree: ConnectedPlayer;

        given("Three players are in an active game", async () => {
            playerOne = await joinGame(game.id.getValue(), "test player 1", spectator);
            playerTwo = await joinGame(game.id.getValue(), "test player 2", spectator);
            playerThree = await joinGame(game.id.getValue(), "test player 3", spectator);

            fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        when("All players respond with different hands", () => {
            playerOne.respondWithHand("paper");
            playerTwo.respondWithHand("scissors");
            playerThree.respondWithHand("rock");
        });

        then("The game declares a draw", async () => {
            await spectator.waitForStatus(({status}) => status === "round_drawn");
        });
    });

    test("N+1 players: multiple winners", ({
        given,
        when,
        and,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        let playerOne: ConnectedPlayer;
        let playerTwo: ConnectedPlayer;
        let playerThree: ConnectedPlayer;

        given("At least three players are in an active game", async () => {
            playerOne = await joinGame(game.id.getValue(), "test player 1", spectator);
            playerTwo = await joinGame(game.id.getValue(), "test player 2", spectator);
            playerThree = await joinGame(game.id.getValue(), "test player 3", spectator);

            fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        when("At least two players respond with 'scissors'", () => {
            playerOne.respondWithHand("scissors");
            playerTwo.respondWithHand("scissors");
        });

        and("The remaining players respond with 'paper'", () => {
            playerThree.respondWithHand("paper");
        });

        then("The game starts new round with those two players", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "round_started");

            expect(data.message)
                .toMatch(
                    new RegExp(
                        `^Starting round in ${game.id.getValue()} with test player {1,2}\\d,test player {1,2}\\d`
                    )
                );
        });
    });

    test("Identical hands", ({
        given,
        when,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        let playerOne: ConnectedPlayer;
        let playerTwo: ConnectedPlayer;

        given("At least two players are in an active game", async () => {
            playerOne = await joinGame(game.id.getValue(), "test player 1", spectator);
            playerTwo = await joinGame(game.id.getValue(), "test player 2", spectator);

            fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        when("All players respond with the same hand", () => {
            playerOne.respondWithHand("paper");
            playerTwo.respondWithHand("paper");
        });

        then("The game declares a draw", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "round_drawn");

            expect(data.message)
                .toMatch(
                    new RegExp(
                        // eslint-disable-next-line max-len
                        `^Round ends with a draw in ${game.id.getValue()} with test player {1,2}\\d,test player {1,2}\\d`
                    )
                );
        });
    });
});
