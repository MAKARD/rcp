export class CountdownController {
    constructor (
        private readonly timeout = 5
    ) {
        this.countdown = timeout;
    }

    private interval?: NodeJS.Timeout;

    private countdown: number;

    public isRunning () {
        return !!this.interval;
    }

    public reset () {
        clearInterval(this.interval);
        this.countdown = this.timeout;

        this.interval = undefined;
    }

    public run (callback: (countdown: number) => void) {
        this.reset();

        this.interval = setInterval(() => {
            callback(this.countdown);

            if (this.countdown === 0) {
                this.reset();

                return;
            }

            this.countdown--;
        }, 1000);
    }

}
