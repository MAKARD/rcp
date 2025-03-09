import {BehaviorSubject} from "rxjs";

import {createGame} from "../actions/create-game.action";

export function gameCreator () {
    const gameId = new BehaviorSubject<string>("");

    beforeAll(async () => {
        gameId.next(await createGame());
    });

    afterAll(() => {
        gameId.next("");
    });

    return {
        "id": gameId
    };
}
