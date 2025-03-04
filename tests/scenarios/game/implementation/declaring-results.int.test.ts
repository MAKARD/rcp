import {defineFeature, loadFeature} from "jest-cucumber";

import {gameCreator, gameSpectator} from "../../../hooks";
import {ConnectedPlayer, fastForwardTimer, joinGame} from "../../../actions";

const feature = loadFeature("tests/scenarios/game/features/declaring-results.feature");

defineFeature(feature, test => {
    test("Single winner", ({
        given,
        and,
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

        and("All players have responded with a different hand 'paper', 'rock', or 'scissors'", async () => {
            playerOne.respondWithHand("paper");
            playerTwo.respondWithHand("rock");
        });

        when("The game declares a winner", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "game_ended_with_winner");

            expect(data.message).toBe(`Game ${game.id.getValue()} won by test player 1 with paper`);
        });

        then("The game determines the next game starting quorum", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "game_is_allowed_to_start");

            expect(data.message).toBe(`Game ${game.id.getValue()} is allowed to start`);
        });

    });

    test("Multiple winners", ({
        given,
        and,
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

        and("All players have responded with the same hand 'paper', 'rock', or 'scissors'", () => {
            playerOne.respondWithHand("paper");
            playerTwo.respondWithHand("paper");
        });

        when("The game declares a draw", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "round_drawn");

            expect(data.message)
                .toMatch(
                    new RegExp(
                        // eslint-disable-next-line max-len
                        `^Round ends with a draw in ${game.id.getValue()} with test player {1,2}\\d,test player {1,2}\\d`
                    )
                );
        });

        then("The game starts the next round with all winners", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "round_started");

            expect(data.message)
                .toMatch(
                    new RegExp(
                        `^Starting round in ${game.id.getValue()} with test player {1,2}\\d,test player {1,2}\\d`
                    )
                );
        });
    });

    test("No winners", ({
        given,
        and,
        when,
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
            playerThree = await joinGame(game.id.getValue(), "test player 2", spectator);

            fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        and("All players have responded with a different hand 'paper', 'rock', or 'scissors'", () => {
            playerOne.respondWithHand("paper");
            playerTwo.respondWithHand("rock");
            playerThree.respondWithHand("scissors");
        });

        when("The game declares a draw", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "round_drawn");

            expect(data.message)
                .toMatch(
                    new RegExp(
                        // eslint-disable-next-line max-len
                        `^Round ends with a draw in ${game.id.getValue()} with test player {1,3}\\d,test player {1,3}\\d,test player {1,3}\\d`
                    )
                );
        });

        then("The game starts the next round with all players who initially played the round", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "round_started");

            expect(data.message)
                .toMatch(
                    new RegExp(
                    // eslint-disable-next-line max-len
                        `^Starting round in ${game.id.getValue()} with test player {1,3}\\d,test player {1,3}\\d,test player {1,3}\\d`
                    )
                );
        });
    });
});
