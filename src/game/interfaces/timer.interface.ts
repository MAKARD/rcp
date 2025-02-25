import {ReadOnlyStateSubject} from "../../common/observables/ReadOnlyStateSubject";

export interface Timer {
    readonly "id": string;
    readonly "timeLeft": ReadOnlyStateSubject<number>;

    reset(): void;
}
