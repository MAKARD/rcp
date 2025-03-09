import {Subject} from "rxjs";

import {Timer} from "../interfaces/timer.interface";

export class TimerModel implements Timer {
    public readonly timeLeft = new Subject<number>();

    private interval?: NodeJS.Timeout;

    constructor (
        public readonly id: string,
        private timeout = 5
    ) {
        queueMicrotask(() => {
            this.timeLeft.next(this.timeout--);
        });

        this.interval = setInterval(() => {
            this.timeLeft.next(this.timeout--);

            if (this.timeout === 0) {
                this.reset();
            }
        }, 1000);
    }

    reset () {
        clearInterval(this.interval);
        this.interval = undefined;

        this.timeLeft.complete();
    }

    fastForward () {
        this.timeLeft.next(0);

        this.reset();
    }
}
