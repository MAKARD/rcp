import {Game, GameEvents} from "../Game";
import {Player, PlayerJSON} from "../Player";
// import {PlayerEvents} from "../Player/PlayerEvents";

export class GameController {
    private game: Game;

    private connectedPlayers = new Map<string, Player>();

    constructor (
        gameEvents: GameEvents
    ) {
        this.game = new Game([], gameEvents);
    }

    public play () {
        return this.game.play();
    }

    public getConnectedPlayer (connectionId: string) {
        return this.connectedPlayers.get(connectionId);
    }

    public getPlayerById (playerId: string) {
        const result = this.game.players.find((player) => player.id === playerId);

        if (!result) {
            throw new Error("Not found");
        }

        return result;
    }

    public removeConnectedPlayer (connectionId: string) {
        const player = this.connectedPlayers.get(connectionId);

        if (!player) {
            return;
        }

        this.connectedPlayers.delete(connectionId);
        this.game.removePlayer(player);
    }

    public addConnectedPlayer (connectionId: string, playerData: PlayerJSON) {
        // const playerEvents = new PlayerEvents();

        const player = new Player(
            playerData.name,
            // playerEvents,
            playerData.id
        );

        this.connectedPlayers.set(connectionId, player);

        this.game.registerPlayer(player);

        return player;
    }

}
