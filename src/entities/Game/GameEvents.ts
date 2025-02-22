import EventEmitter from "node:events";

import {PlayerJSON} from "../Player";

interface Events {
    "onDraw": [
        playersInGame: Array<PlayerJSON>
    ];
    "onWin": [
        winner: PlayerJSON
    ];
    "onRound": [
        playersInGame: Array<PlayerJSON>
    ];
    "onNoPlayersLeft": [];
    "onRequestPlayersHand": [];
    "onAllowanceToStartStatusChange": [allowed: boolean];
}

export class GameEvents extends EventEmitter<Events> {
}
