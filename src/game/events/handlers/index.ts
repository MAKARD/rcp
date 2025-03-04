import {GameCountdownTickHandler} from "./game-countdown-tick.handler";
import {GameCreatedHandler} from "./game-created.handler";
import {GameEndedHandler} from "./game-ended.handler";
import {GameStartAllowedHandler} from "./game-start-allowed.handler";
import {GameStartDeniedHandler} from "./game-start-denied.handler";
import {PlayerAddedHandler} from "./player-added.handler";
import {PlayerInvalidHandHandler} from "./player-invalid-hand.handler";
import {PlayerMovedToSpectatorsHandler} from "./player-moved-to-spectators.handler";
import {PlayerRemovedHandler} from "./player-removed.handler";
import {PlayerSetHandHandler} from "./player-set-hand.handler";
import {RoundDrawnHandler} from "./round-drawn.handler";
import {RoundStartHandler} from "./round-started.handler";
import {SpectatorMovedToPlayersHandler} from "./spectator-moved-to-players.handler";

export const EventHandlers = [
    GameCountdownTickHandler,
    GameCreatedHandler,
    GameEndedHandler,
    GameStartAllowedHandler,
    GameStartDeniedHandler,
    PlayerAddedHandler,
    PlayerInvalidHandHandler,
    PlayerMovedToSpectatorsHandler,
    PlayerRemovedHandler,
    PlayerSetHandHandler,
    RoundDrawnHandler,
    RoundStartHandler,
    SpectatorMovedToPlayersHandler
];
