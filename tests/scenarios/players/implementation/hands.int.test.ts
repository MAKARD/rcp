import {defineFeature, loadFeature} from "jest-cucumber";

const feature = loadFeature("tests/scenarios/players/features/hands.feature");

defineFeature(feature, test => {
    test("Asking players for their hands", ({
        given,
        when,
        then
    }) => {
        given("At least two players are in an active game", () => {

        });

        when("The next round starts", () => {

        });

        then("All joined players are asked for their hand", () => {

        });
    });
    test("Invalid response", ({
        given,
        and,
        when,
        then
    }) => {
        given("At least two players are in an active game", () => {

        });

        and("All players have been asked for their hand", () => {

        });

        when("A player responds with a hand other than 'paper', 'rock', or 'scissors'", () => {

        });

        then("The game keeps waiting for a valid response", () => {

        });
    });
    test("Valid response", ({
        given,
        and,
        when,
        then
    }) => {
        given("At least two players are in an active game", () => {

        });

        and("All players have been asked for their hand", () => {

        });

        when("A player responds with 'paper', 'rock', or 'scissors'", () => {

        });

        then("The game accepts their response", () => {

        });
    });
    test("No response", ({
        given,
        and,
        when,
        then
    }) => {
        given("At least two players are in an active game", () => {

        });

        and("All players have been asked for their hand", () => {

        });

        when("A player does not respond within 10 seconds", () => {

        });

        then("The player is removed from the game", () => {

        });
    });
    test("All set", ({
        given,
        when,
        then
    }) => {
        given("At least two players are in an active game", () => {

        });

        when("All players respond with 'paper', 'rock', or 'scissors'", () => {

        });

        then("The game declares the results", () => {

        });
    });
});
