import {BehaviorSubject, skip, Subject, takeUntil} from "rxjs";

export class ReadOnlyStateSubject<T> {
    protected subject: BehaviorSubject<T>;

    private terminate = new Subject<void>();

    constructor (initialValue: T) {
        this.subject = new BehaviorSubject(initialValue);
    }

    getValue (): T {
        return this.subject.getValue();
    }

    subscribe (callback: (value: T) => void) {
        return this.subject
            .pipe(takeUntil(this.terminate))
            .pipe(skip(1))
            .subscribe(callback);
    }

    unsubscribe () {
        this.terminate.next();
    }
}
