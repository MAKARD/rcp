
import {defineFeature, loadFeature} from "jest-cucumber";
import waitForExpect from "wait-for-expect";

import {gameCreator, gameSpectator} from "../../../hooks";
import {ConnectedPlayer, CreatedSpectator, createGame, createSpectator, fastForwardTimer, getGameStatus, joinGame} from "../../../actions";

const feature = loadFeature("tests/scenarios/game/features/core.feature");

defineFeature(feature, test => {
    test("Creating game", ({
        given,
        then
    }) => {
        let id: string;

        given("A user made a POST /create request", async () => {
            id = await createGame();
        });

        then("The user receives the created game ID in response", () => {
            expect(id).toBeDefined();
        });
    });

    test("Starting game", ({
        given,
        and,
        then
    }) => {
        const game = gameCreator("Starting game");
        const spectator = gameSpectator(game.id);

        given("At least two players are in a game", async () => {
            await joinGame(game.id.getValue(), "test player 1", spectator);

            await joinGame(game.id.getValue(), "test player 2", spectator);
        });

        and("The game has finished counting down", async () => {
            fastForwardTimer(game.id.getValue());

            await spectator.waitForStatus(({status}) => status === "round_started");
        });

        then("The game starts with all joined players", async () => {
            const status = await getGameStatus(game.id.getValue());

            expect(status.players.map(({name}) => name)).toIncludeAllMembers(["test player 1", "test player 2"]);
        });
    });

    test("Playing multiple games", ({
        given,
        and,
        when,
        then
    }) => {
        let gameOneId: string;
        let gameTwoId: string;

        let spectatorGameOne: CreatedSpectator;
        let spectatorGameTwo: CreatedSpectator;

        const playersArray: Array<ConnectedPlayer> = [];

        afterAll(() => {
            spectatorGameOne?.disconnect();
            spectatorGameTwo?.disconnect();
        });

        given("At least two games have been created", async () => {
            [gameOneId, gameTwoId] = await Promise.all([
                createGame(),
                createGame()
            ]);

            [spectatorGameOne, spectatorGameTwo] = await Promise.all([
                createSpectator(gameOneId),
                createSpectator(gameTwoId)
            ]);
        });

        and("All games have reached their starting quorum", async () => {
            playersArray.push(await joinGame(gameOneId, "game 1 player 1", spectatorGameOne));
            playersArray.push(await joinGame(gameOneId, "game 1 player 2", spectatorGameOne));
            playersArray.push(await joinGame(gameTwoId, "game 2 player 1", spectatorGameTwo));
            playersArray.push(await joinGame(gameTwoId, "game 2 player 2", spectatorGameTwo));
        });

        when("The games start", async () => {
            fastForwardTimer(gameOneId);
            fastForwardTimer(gameTwoId);

            await Promise.all([
                spectatorGameOne.waitForStatus(({status}) => status === "round_started"),
                spectatorGameTwo.waitForStatus(({status}) => status === "round_started")
            ]);
        });

        then("Each game progresses independently", async () => {
            await Promise.all(
                playersArray
                    .map((player) => waitForExpect(() => expect(player.handRequestListener).toHaveBeenCalledTimes(1)))
            );

            const [
                gameOnePlayerOne,
                gameOnePlayerTwo,
                gameTwoPlayerOne
            ] = playersArray;

            gameOnePlayerOne.respondWithHand("paper");
            await spectatorGameOne.waitForStatus(({status}) => status === "hand_set");

            gameOnePlayerTwo.respondWithHand("kek");
            await spectatorGameOne.waitForStatus(({status}) => status === "invalid_hand");

            gameTwoPlayerOne.disconnect();
            const dataGameTwo = await spectatorGameTwo.waitForStatus(({status}) => status === "game_ended_with_winner");

            expect(dataGameTwo.message).toBe(`Game ${gameTwoId} won by game 2 player 2 with no hand`);

            gameOnePlayerTwo.respondWithHand("scissors");
            const dataGameOne = await spectatorGameOne.waitForStatus(({status}) => status === "game_ended_with_winner");

            expect(dataGameOne.message).toBe(`Game ${gameOneId} won by game 1 player 2 with scissors`);
        });
    });
});
