import {defineFeature, loadFeature} from "jest-cucumber";

const feature = loadFeature("tests/scenarios/game/features/declaring-results.feature");

defineFeature(feature, test => {
    test("Single winner", ({
        given,
        and,
        when,
        then
    }) => {
        given("At least two players are in an active game", () => {

        });

        and("All players have responded with 'paper', 'rock', or 'scissors'", () => {

        });

        when("The game declares a winner", () => {

        });

        then("The game determines the next game starting quorum", () => {

        });
    });
    test("Multiple winners", ({
        given,
        and,
        when,
        then
    }) => {
        given("At least two players are in an active game", () => {

        });

        and("All players have responded with 'paper', 'rock', or 'scissors'", () => {

        });

        when("The game declares a draw", () => {

        });

        then("The game starts the next round with all winners", () => {

        });
    });
    test("No winners", ({
        given,
        and,
        when,
        then
    }) => {
        given("At least two players are in an active game", () => {

        });

        and("All players have responded with 'paper', 'rock', or 'scissors'", () => {

        });

        when("The game declares a draw", () => {

        });

        then("The game starts the next round with all players who initially played the round", () => {

        });
    });
});
