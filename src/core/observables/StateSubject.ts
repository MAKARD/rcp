import {ReadOnlyStateSubject} from "./ReadOnlyStateSubject";

export class StateSubject<T> extends ReadOnlyStateSubject<T> {
    next (newValue: T) {
        this.subject.next(newValue);
    }
}
