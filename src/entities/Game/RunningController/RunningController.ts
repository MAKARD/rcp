import {RunningEvents} from "./RunningEvents";

interface Player {
    "isSpectator": boolean;
}

export class RunningController {
    private _notAllowedToRunReason?: string;

    private set notAllowedToRunReason (nextValue) {
        this._notAllowedToRunReason = nextValue;
    }

    private get notAllowedToRunReason () {
        return this._notAllowedToRunReason;
    }

    private abortController: AbortController;

    constructor (
        private players: Array<Player>
    ) {
        this.updateStatus();
    }

    public eventEmitter = new RunningEvents();

    private updateStatus () {
        if (this.players.filter((player) => !player.isSpectator).length < 2) {
            this.notAllowedToRunReason = "insufficient_number_of_players";

            this.eventEmitter.emit("onStatusChange", false);

            this.abortController?.abort();

            return;
        }

        if (this.abortController && !this.abortController.signal.aborted) {
            this.notAllowedToRunReason = "is_active";

            return;
        }

        this.eventEmitter.emit("onStatusChange", true);
        this.notAllowedToRunReason = undefined;
    }

    public async run (callback: (
        stop: () => void,
        abortSignal: AbortSignal
    ) => Promise<void>) {
        if (this.notAllowedToRunReason) {
            throw new Error(this.notAllowedToRunReason);
        }

        this.abortController = new AbortController();

        this.updateStatus();

        this.eventEmitter.emit("onStart");

        while (!this.abortController.signal.aborted) {
            await callback(
                () => {
                    this.abortController.abort();

                    this.updateStatus();

                    this.eventEmitter.emit("onStop");
                },
                this.abortController.signal
            );
        }
    }

    public notifyChange (players: Array<Player>) {
        this.players = players;

        this.updateStatus();
    }
}
