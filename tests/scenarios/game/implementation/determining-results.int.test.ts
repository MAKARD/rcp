import {defineFeature, loadFeature} from "jest-cucumber";

const feature = loadFeature("tests/scenarios/game/features/determining-results.feature");

defineFeature(feature, test => {
    test("Two players: paper vs. rock", ({
        given,
        when,
        and,
        then
    }) => {
        given("Two players are in an active game", () => {

        });

        when("The first player responds with 'paper'", () => {

        });

        and("The second player responds with 'rock'", () => {

        });

        then("The game declares the first player the winner", () => {

        });
    });
    test("Two players: scissors vs. paper", ({
        given,
        when,
        and,
        then
    }) => {
        given("Two players are in an active game", () => {

        });

        when("The first player responds with 'scissors'", () => {

        });

        and("The second player responds with 'paper'", () => {

        });

        then("The game declares the first player the winner", () => {

        });
    });
    test("Two players: rock vs. scissors", ({
        given,
        when,
        and,
        then
    }) => {
        given("Two players are in an active game", () => {

        });

        when("The first player responds with 'rock'", () => {

        });

        and("The second player responds with 'scissors'", () => {

        });

        then("The game declares the first player the winner", () => {

        });
    });
    test("Three players: no winners", ({
        given,
        when,
        then
    }) => {
        given("Three players are in an active game", () => {

        });

        when("All players respond with different hands", () => {

        });

        then("The game declares a draw", () => {

        });
    });
    test("N+1 players: multiple winners", ({
        given,
        when,
        and,
        then
    }) => {
        given("At least three players are in an active game", () => {

        });

        when("At least two players respond with 'scissors'", () => {

        });

        and("The remaining players respond with 'paper'", () => {

        });

        then("The game declares a draw", () => {

        });
    });
    test("Identical hands", ({
        given,
        when,
        then
    }) => {
        given("At least two players are in an active game", () => {

        });

        when("All players respond with the same hand", () => {

        });

        then("The game declares a draw", () => {

        });
    });
});
