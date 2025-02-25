import {defineFeature, loadFeature} from "jest-cucumber";

const feature = loadFeature("tests/scenarios/quorum/features/active-game.feature");

defineFeature(feature, test => {
    test("Losing starting quorum: one player left", ({
        given,
        when,
        then,
        and
    }) => {
        given("At most two players are in an active game", () => {

        });

        when("A player leaves the game", () => {

        });

        then("The game stops", () => {

        });

        and("The remaining player is declared the winner", () => {

        });
    });
    test("Losing starting quorum: no players left", ({
        given,
        when,
        then,
        and
    }) => {
        given("At least two players are in an active game", () => {

        });

        when("All players leave the game", () => {

        });

        then("The game stops", () => {

        });

        and("The game declares a draw", () => {

        });
    });
    test("Maintaining starting quorum: player left", ({
        given,
        when,
        then
    }) => {
        given("At least three players are in an active game", () => {

        });

        when("A player leaves the game", () => {

        });

        then("The game continues with the remaining players", () => {

        });
    });
    test("Maintaining starting quorum: player joined", ({
        given,
        when,
        then,
        and
    }) => {
        given("At least two players are in an active game", () => {

        });

        when("A player joins the game", () => {

        });

        then("The game continues with the initially joined players", () => {

        });

        and("The joined player becomes a spectator", () => {

        });
    });
    test("Maintaining starting quorum: spectator left", ({
        given,
        and,
        when,
        then
    }) => {
        given("At least two players are in an active game", () => {

        });

        and("At least one spectator is in the active game", () => {

        });

        when("A spectator leaves the game", () => {

        });

        then("The game continues with the initially joined players", () => {

        });
    });
});
