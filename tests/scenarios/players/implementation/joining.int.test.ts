import {defineFeature, loadFeature} from "jest-cucumber";

const feature = loadFeature("tests/scenarios/players/features/joining.feature");

defineFeature(feature, test => {
    test("One player", ({
        given,
        when,
        then
    }) => {
        given("A player connected to the socket gateway", () => {

        });

        when("The player emits the 'player/join' event", () => {

        });

        then("The player joins the game they passed in params", () => {

        });
    });
    test("N+1 players", ({
        given,
        and,
        when,
        then
    }) => {
        given("At least one player is already in a game", () => {

        });

        and("A player connected to the socket gateway", () => {

        });

        when("The player emits the 'player/join' event", () => {

        });

        then("The player joins the game they passed in params", () => {

        });
    });
});
