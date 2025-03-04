import {StateSubject} from "../../common/observables/StateSubject";
import {Timer} from "../interfaces/timer.interface";

export class TimerModel implements Timer {
    private interval?: NodeJS.Timeout;

    public timeLeft: StateSubject<number>;

    constructor (
        public readonly id: string,
        private readonly timeout = 5
    ) {
        this.timeLeft = new StateSubject(0);

        queueMicrotask(() => {
            this.timeLeft.next(this.timeout);
        });

        this.interval = setInterval(() => {
            if (this.timeLeft.getValue() === 0) {
                this.reset();

                return;
            }

            this.timeLeft.next(this.timeLeft.getValue() - 1);
        }, 1000);
    }

    reset () {
        clearInterval(this.interval);
        this.interval = undefined;

        this.timeLeft.unsubscribe();
        this.timeLeft.next(this.timeout);
    }

    fastForward () {
        this.timeLeft.next(0);

        this.reset();
    }
}
