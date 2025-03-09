import {AddPlayerCommandHandler} from "./add-player.command";
import {CreateGameCommandHandler} from "./create-game.command";
import {FastForwardTimerCommandHandler} from "./fast-forward-timer.command";
import {RemovePlayerCommandHandler} from "./remove-player.command";
import {RequestPlayersHandsCommandHandler} from "./request-players-hands.command";
import {StartGameCommandHandler} from "./start-game.command";

export const CommandHandlers = [
    AddPlayerCommandHandler,
    CreateGameCommandHandler,
    FastForwardTimerCommandHandler,
    RemovePlayerCommandHandler,
    RequestPlayersHandsCommandHandler,
    StartGameCommandHandler
];
