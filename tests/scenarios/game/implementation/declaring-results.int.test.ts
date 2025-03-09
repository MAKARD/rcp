import {defineFeature, loadFeature} from "jest-cucumber";

import {gameCreator} from "../../../hooks/game-creator.hook";
import {gameSpectator} from "../../../hooks/game-spectator.hook";
import {ConnectedPlayer, joinGame} from "../../../actions/join-game.action";
import {fastForwardTimer} from "../../../actions/fast-forward-timer.action";

const feature = loadFeature("tests/scenarios/game/features/declaring-results.feature");

defineFeature(feature, (test) => {
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
            playerOne = await joinGame(game.id.getValue(), "test player 1");
            playerTwo = await joinGame(game.id.getValue(), "test player 2");

            await fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        and("All players have responded with a different hand 'paper', 'rock', or 'scissors'", async () => {
            playerOne.respondWithHand("paper");
            playerTwo.respondWithHand("rock");
        });

        when("The game declares a winner", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "game_ended_with_winner");

            expect(data.event.gameId).toBe(game.id.getValue());
            expect(data.event.winner.name).toBe("test player 1");
        });

        then("The game determines the next game starting quorum", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "game_is_allowed_to_start");

            expect(data.event.gameId).toBe(game.id.getValue());
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
            playerOne = await joinGame(game.id.getValue(), "test player 1");
            playerTwo = await joinGame(game.id.getValue(), "test player 2");

            await fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        and("All players have responded with the same hand 'paper', 'rock', or 'scissors'", () => {
            playerOne.respondWithHand("paper");
            playerTwo.respondWithHand("paper");
        });

        when("The game declares a draw", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "round_drawn");

            expect(data.event.gameId).toBe(game.id.getValue());
            expect(data.event.playersInRound).toIncludeAllPartialMembers([
                {
                    "name": "test player 1"
                },
                {
                    "name": "test player 2"
                }
            ]);
        });

        then("The game starts the next round with all winners", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "round_started");

            expect(data.event.gameId).toBe(game.id.getValue());
            expect(data.event.playersInRound).toIncludeAllPartialMembers([
                {
                    "name": "test player 1"
                },
                {
                    "name": "test player 2"
                }
            ]);
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
            playerOne = await joinGame(game.id.getValue(), "test player 1");
            playerTwo = await joinGame(game.id.getValue(), "test player 2");
            playerThree = await joinGame(game.id.getValue(), "test player 3");

            await fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        and("All players have responded with a different hand 'paper', 'rock', or 'scissors'", () => {
            playerOne.respondWithHand("paper");
            playerTwo.respondWithHand("rock");
            playerThree.respondWithHand("scissors");
        });

        when("The game declares a draw", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "round_drawn");

            expect(data.event.gameId).toBe(game.id.getValue());
            expect(data.event.playersInRound).toIncludeAllPartialMembers([
                {
                    "name": "test player 1"
                },
                {
                    "name": "test player 2"
                },
                {
                    "name": "test player 3"
                }
            ]);
        });

        then("The game starts the next round with all players who initially played the round", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "round_started");

            expect(data.event.gameId).toBe(game.id.getValue());
            expect(data.event.playersInRound).toIncludeAllPartialMembers([
                {
                    "name": "test player 1"
                },
                {
                    "name": "test player 2"
                }
            ]);
        });
    });
});
