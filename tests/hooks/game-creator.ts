import {BehaviorSubject} from "rxjs";

import {createGame} from "../actions";

export function gameCreator (gameName: string = "fuck") {
    const gameId = new BehaviorSubject<string>("");

    beforeAll(async () => {
        gameId.next(await createGame(gameName));
    });

    afterAll(() => {
        gameId.next("");
    });

    return {
        "id": gameId
    };
}
