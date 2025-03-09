import {ExceptionEventHandler} from "./exception.event";
import {GameCountdownTickEventHandler} from "./game-countdown-tick.event";
import {GameCreatedEventHandler} from "./game-created.event";
import {GameEndedEventHandler} from "./game-ended.event";
import {GameStartAllowedEventHandler} from "./game-start-allowed.event";
import {GameStartDeniedEventHandler} from "./game-start-denied.event";
import {PlayerAddedEventHandler} from "./player-added.event";
import {PlayerInvalidHandEventHandler} from "./player-invalid-hand.event";
import {PlayerRemovedEventHandler} from "./player-removed.event";
import {PlayerSetHandEventHandler} from "./player-set-hand.event";
import {RoundDrawnEventHandler} from "./round-drawn.event";
import {RoundStartEventHandler} from "./round-started.event";

export const EventHandlers = [
    ExceptionEventHandler,
    GameCountdownTickEventHandler,
    GameCreatedEventHandler,
    GameEndedEventHandler,
    GameStartAllowedEventHandler,
    GameStartDeniedEventHandler,
    PlayerAddedEventHandler,
    PlayerInvalidHandEventHandler,
    PlayerRemovedEventHandler,
    PlayerSetHandEventHandler,
    RoundDrawnEventHandler,
    RoundStartEventHandler
];
