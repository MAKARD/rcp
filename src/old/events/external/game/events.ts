import {PlayerJSON} from "../../../entities/Player";

export interface Events {
    "network/game:waiting": () => void;
    "network/game:round:draw": (playersInGame: Array<PlayerJSON>) => void;
    "network/game:ended": (winner?: PlayerJSON) => void;
    "network/game:round:started": (playersInGame: Array<PlayerJSON>) => void;
    "network/game:countdown": (timeLeft: number) => void;
}
