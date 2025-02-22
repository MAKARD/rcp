import {GameEvents} from "../Game";
import {PlayerJSON} from "../Player";

import {CountdownController} from "./CountdownController";
import {GameController} from "./GameController";

export class Session {
    constructor (
        public id: string,
        timeout = 5
    ) {
        this.gameEvents = new GameEvents();

        this.countdownController = new CountdownController(timeout);
        this.gameController = new GameController(this.gameEvents);
    }

    public gameEvents: GameEvents;

    private countdownController: CountdownController;

    private gameController: GameController;

    public addConnectedPlayer (connectionId: string, playerData: PlayerJSON) {
        return this.gameController.addConnectedPlayer(connectionId, playerData);
    }

    public removeConnectedPlayer (connectionId: string) {
        this.gameController.removeConnectedPlayer(connectionId);
    }

    public getConnectedPlayer (connectionId: string) {
        return this.gameController.getConnectedPlayer(connectionId);
    }

    public getPlayerById (playerId: string) {
        return this.gameController.getPlayerById(playerId);
    }

    public initiateStarting (callback: (timeLeft: number) => void) {
        if (this.countdownController.isRunning()) {
            return;
        }

        this.gameEvents.once("onAllowanceToStartStatusChange", (status) => {
            if (!status) {
                this.countdownController.reset();

                callback(NaN);
            }
        });

        this.countdownController.run((timeLeft) => {
            if (timeLeft === 0) {

                this.gameController.play()
                    .catch((error) => {
                        console.log("Game error", error);
                    });
            }

            callback(timeLeft);
        });
    }
}
