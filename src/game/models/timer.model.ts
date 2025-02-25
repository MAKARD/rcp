import {StateSubject} from "../../common/observables/StateSubject";
import {Timer} from "../interfaces/timer.interface";

export class TimerModel implements Timer {
    private interval?: NodeJS.Timeout;

    constructor (
        public readonly id: string,
        private readonly timeout = 5
    ) {
        this.timeLeft = new StateSubject(this.timeout);

        this.interval = setInterval(() => {
            this.timeLeft.setValue(this.timeLeft.getValue() - 1);

            if (this.timeLeft.getValue() === 0) {
                this.reset();

                return;
            }
        }, 1000);
    }

    timeLeft: StateSubject<number>;

    reset () {
        clearInterval(this.interval);
        this.interval = undefined;

        this.timeLeft.unsubscribe();
        this.timeLeft.setValue(this.timeout);
    }
}
