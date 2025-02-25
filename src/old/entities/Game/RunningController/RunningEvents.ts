import EventEmitter from "node:events";

interface Events {
    "onStart": [];
    "onStop": [];
    "onStatusChange": [status: boolean];
}

export class RunningEvents extends EventEmitter<Events> {}
