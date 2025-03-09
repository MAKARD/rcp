import {Subject} from "rxjs";

export interface Timer {
    readonly "id": string;
    readonly "timeLeft": Subject<number>;

    reset(): void;
    fastForward(): void;
}
