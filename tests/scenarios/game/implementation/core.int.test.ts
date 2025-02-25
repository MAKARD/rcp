import {defineFeature, loadFeature} from "jest-cucumber";

const feature = loadFeature("tests/scenarios/game/features/core.feature");

defineFeature(feature, test => {
    test("Creating game", ({
        given,
        then
    }) => {
        given("A user made a POST /create request", async () => {
            try {
                const response = await fetch("http://localhost:3005/game/create", {
                    "method": "POST"
                });
                console.log(await response.json());
            } catch (error) {
                console.log(error);
            }
        });

        then("The user receives the created game ID in response", () => {

        });
    });
    test("Starting game", ({
        given,
        and,
        then
    }) => {
        given("At least two players are in a game", () => {

        });

        and("The game has finished counting down", () => {

        });

        then("The game starts with all joined players", () => {

        });
    });
    test("Playing multiple games", ({
        given,
        and,
        when,
        then
    }) => {
        given("At least two games have been created", () => {

        });

        and("All games have reached their starting quorum", () => {

        });

        when("The games start", () => {

        });

        then("Each game progresses independently", () => {

        });
    });
});
