import {defineFeature, loadFeature} from "jest-cucumber";

import {gameCreator, gameSpectator} from "../../../hooks";
import {ConnectedPlayer, fastForwardTimer, getGameStatus, joinGame} from "../../../actions";

const feature = loadFeature("tests/scenarios/quorum/features/active-game.feature");

defineFeature(feature, test => {

    test("Losing starting quorum: one player left", ({
        given,
        when,
        then,
        and
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        let playerOne: ConnectedPlayer;

        given("At most two players are in an active game", async () => {
            playerOne = await joinGame(game.id.getValue(), "test player 1", spectator);
            await joinGame(game.id.getValue(), "test player 2", spectator);

            fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        when("A player leaves the game", () => {
            playerOne.disconnect();
        });

        then("The game stops", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "game_is_denied_to_start");

            expect(data.message).toBe(`Game ${game.id.getValue()} is denied to start`);
        });

        and("The remaining player is declared the winner", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "game_ended_with_winner");

            expect(data.message).toBe(`Game ${game.id.getValue()} won by test player 2 with no hand`);
        });
    });

    test("Maintaining starting quorum: player left", ({
        given,
        when,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        let playerOne: ConnectedPlayer;

        given("At least three players are in an active game", async () => {
            playerOne = await joinGame(game.id.getValue(), "test player 1", spectator);
            await joinGame(game.id.getValue(), "test player 2", spectator);
            await joinGame(game.id.getValue(), "test player 3", spectator);

            fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        when("A player leaves the game", () => {
            playerOne.disconnect();
        });

        then("The game continues with the remaining players", async () => {
            const status = await getGameStatus(game.id.getValue());

            expect(status.players.map(({name}) => name)).toIncludeAllMembers(["test player 2", "test player 3"]);
        });
    });

    test("Maintaining starting quorum: player joined", ({
        given,
        when,
        then,
        and
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        given("At least two players are in an active game", async () => {
            await joinGame(game.id.getValue(), "test player 1", spectator);
            await joinGame(game.id.getValue(), "test player 2", spectator);

            fastForwardTimer(game.id.getValue());
            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        when("A player joins the game", () => {
            joinGame(game.id.getValue(), "test player 3");
        });

        then("The joined player joins as a spectator", async () => {
            const data = await spectator.waitForStatus(({status}) => status === "spectator_added");

            expect(data.message).toBe(`Player test player 3 added to ${game.id.getValue()}`);
        });

        and("The game continues with the initially joined players", async () => {
            const status = await getGameStatus(game.id.getValue());

            expect(status.players.map(({name}) => name)).toIncludeAllMembers(["test player 1", "test player 2"]);
            expect(status.spectators.map(({name}) => name)).toIncludeAllMembers(["test player 3"]);
        });
    });

    test("Maintaining starting quorum: spectator left", ({
        given,
        and,
        when,
        then
    }) => {
        const game = gameCreator();
        const spectator = gameSpectator(game.id);

        given("At least two players are in an active game", async () => {
            await joinGame(game.id.getValue(), "test player 1", spectator);
            await joinGame(game.id.getValue(), "test player 2", spectator);

            fastForwardTimer(game.id.getValue());
            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        let spectatorSocket: ConnectedPlayer;
        and("At least one spectator is in the active game", async () => {
            spectatorSocket = await joinGame(game.id.getValue(), "test player 3", spectator);
        });

        when("A spectator leaves the game", () => {
            spectatorSocket.disconnect();
        });

        then("The game continues with the initially joined players", async () => {
            const status = await getGameStatus(game.id.getValue());

            expect(status.players.map(({name}) => name)).toIncludeAllMembers(["test player 1", "test player 2"]);
        });
    });
});
