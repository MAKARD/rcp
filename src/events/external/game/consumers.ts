import {Server, Socket} from "socket.io";

import {Events} from "./events";

export function registerGlobalEventConsumers (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    server: Server<never, Events>
) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function registerScopedEventConsumers (socket: Socket) {
        return function unregisterScopedEventConsumers () {};
    };
}
