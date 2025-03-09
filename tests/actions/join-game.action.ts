import {io, Socket} from "socket.io-client";
import {BehaviorSubject, Subscription} from "rxjs";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace global {
    export let OPENED_SOCKETS: Array<Socket> | undefined;
}

export interface ConnectedPlayer {
    "disconnect": () => void;
    "respondWithHand": (hand: string) => void;
    "fastForwardTimer": () => void;
    "handRequestListener": jest.Mock;
}

interface Response {
    "status": 200 | 400;
    "message"?: string;
}

export async function joinGame (
    gameId: string,
    playerName: string
): Promise<ConnectedPlayer> {
    const socket = io("http://localhost:3005");

    await new Promise<void>((resolve, reject) => {
        socket.emit("player/join", {
            gameId,
            playerName
        }, (response: Response) => {
            if (response.status === 200) {
                resolve();
            } else {
                reject(new Error(response.message));
            }
        });
    });

    if (global.OPENED_SOCKETS) {
        global.OPENED_SOCKETS.push(socket);
    } else {
        global.OPENED_SOCKETS = [socket];
    }

    const handSubject = new BehaviorSubject<string | undefined>(undefined);

    const listener = jest.fn().mockImplementation((respondWithHand: (hand: string) => void) => {
        const subscription = new Subscription();

        subscription.add(handSubject.subscribe((handToRespond) => {
            if (handToRespond) {
                respondWithHand(handToRespond);

                subscription.unsubscribe();
                handSubject.next(undefined);
            }
        }));
    });

    socket.on("player/hand:request", listener);

    return {
        "disconnect": () => socket.disconnect(),
        "fastForwardTimer": () => {
            handSubject.next("INTERNAL_FORWARD_HAND_TIMER");
        },
        "handRequestListener": listener,
        "respondWithHand": (hand: string) => {
            handSubject.next(hand);
        }
    };
}
