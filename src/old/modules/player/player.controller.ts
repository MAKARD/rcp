import {EventBus} from "../shared/event.bus";
import {GamesService} from "../shared/games.service";
import {PlayersService} from "../shared/player.service";

export class PlayerController {
    public joinSession (gameId: string, connectionId: string, playerName: string) {
        try {
            const game = GamesService.sharedInstance.getById(gameId);

            const player = PlayersService.sharedInstance.createPlayer(connectionId, playerName);

            game.registerPlayer(player);

            EventBus.sharedInstance.emit("player/joined", gameId, connectionId);
        } catch {
            EventBus.sharedInstance.emit("player/not-joined", connectionId, playerName);
        }
    }

    public leaveGame (gameId: string, playerId: string) {
        const player = PlayersService.sharedInstance.getById(playerId);

        const game = GamesService.sharedInstance.getById(gameId);

        game.removePlayer(player);

        return player.toJSON();
    }

    public getPlayerById (playerId: string) {
        return PlayersService.sharedInstance.getById(playerId);
    }

    public makeSpectatorPlayer (playerId: string) {
        const player = PlayersService.sharedInstance.getById(playerId);

        player.isSpectator = false;

        return player;
    }

    public makePlayerSpectator (playerId: string) {
        const player = PlayersService.sharedInstance.getById(playerId);

        player.isSpectator = true;

        return player;
    }

    public setPlayerHand (playerId: string, hand: string) {
        const player = PlayersService.sharedInstance.getById(playerId);

        player.currentHand = hand;
    }
}
