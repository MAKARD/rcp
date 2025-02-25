import {defineFeature, loadFeature} from "jest-cucumber";

const feature = loadFeature("tests/scenarios/quorum/features/countdown.feature");

defineFeature(feature, test => {
    test("Reaching starting quorum: player joined", ({
        given,
        when,
        then
    }) => {
        given("At most one player is in a game", () => {

        });

        when("A player joins the game", () => {

        });

        then("The game starts counting down", () => {

        });
    });
    test("Reaching starting quorum: multiple players", ({
        given,
        and,
        then
    }) => {
        given("At least two players are in a game", () => {

        });

        and("The game is not counting down", () => {

        });

        and("The game has not started yet", () => {

        });

        then("The game starts counting down", () => {

        });
    });
    test("Reaching starting quorum: players and spectators", ({
        given,
        and,
        then
    }) => {
        given("At least one player is in a game", () => {

        });

        and("At least one spectator is in the game", () => {

        });

        and("The game is not counting down", () => {

        });

        and("The game has not started yet", () => {

        });

        then("The spectators are moved to players", () => {

        });

        and("The game starts counting down", () => {

        });
    });
    test("Losing starting quorum", ({
        given,
        and,
        when,
        then
    }) => {
        given("At most two players are in a game", () => {

        });

        and("The game is counting down before the start", () => {

        });

        when("A player leaves the game", () => {

        });

        then("The game stops counting down", () => {

        });
    });
    test("Maintaining starting quorum: player left", ({
        given,
        and,
        when,
        then
    }) => {
        given("At least three players are in a game", () => {

        });

        and("The game is counting down before the start", () => {

        });

        when("A player leaves the game", () => {

        });

        then("The game continues counting down", () => {

        });
    });
    test("Maintaining starting quorum: player joined", ({
        given,
        and,
        when,
        then
    }) => {
        given("At least two players are in a game", () => {

        });

        and("The game is counting down before the start", () => {

        });

        when("A player joins the game", () => {

        });

        then("The game continues counting down", () => {

        });
    });
});
