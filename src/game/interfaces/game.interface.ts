import {ReadOnlyStateSubject} from "../../common/observables/ReadOnlyStateSubject";

import {Player} from "./player.interface";

export interface Game {
    readonly "id": string;
    readonly "abortController"?: AbortController;
    readonly "isRunning": ReadOnlyStateSubject<boolean>;

    prepareToStart(): void;
    addPlayer (player: Player): void;
    removePlayer(player: Player): void;
    getPlayers(): Array<Player>;
}
