import {ReadOnlyStateSubject} from "./ReadOnlyStateSubject";

export class StateSubject<T> extends ReadOnlyStateSubject<T> {

    setValue (newValue: T) {
        this.subject.next(newValue);
    }
}
