import {CreateGameHandler} from "./create-game.handler";
import {AddPlayerHandler} from "./add-player.handler";
import {MovePlayerToSpectatorsHandler} from "./move-player-to-spectators.handler";
import {MoveSpectatorToPlayersHandler} from "./move-spectator-to-players.handler";
import {RemovePlayerHandler} from "./remove-player.handler";
import {RequestPlayersHandsHandler} from "./request-players-hands.handler";
import {StartGameHandler} from "./start-game.handler";

export const CommandHandlers = [
    CreateGameHandler,
    AddPlayerHandler,
    MovePlayerToSpectatorsHandler,
    MoveSpectatorToPlayersHandler,
    RemovePlayerHandler,
    RequestPlayersHandsHandler,
    StartGameHandler
];
