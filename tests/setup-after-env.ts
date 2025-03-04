import {Socket} from "socket.io-client";
import * as matchers from "jest-extended";

expect.extend(matchers);

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace global {
    export let OPENED_SOCKETS: Array<Socket> | undefined;
}

afterEach(() => {
    if (global.OPENED_SOCKETS) {
        global.OPENED_SOCKETS.forEach((socket) => socket.close());
    }
});
