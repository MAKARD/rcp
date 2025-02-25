import EventEmitter from "node:events";

interface Events {
    "onChangeStatus": [status: boolean];
    "onSetHand": [];
    "onRegistered": [];
    "onRemoved": [];
}

export class PlayerEvents extends EventEmitter<Events> {
}
