import {io, Socket} from "socket.io-client";
import {BehaviorSubject, Subscription} from "rxjs";

import {CreatedSpectator} from "./create-spectator";

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

export async function joinGame (
    gameId: string,
    playerName: string,
    spectator?: CreatedSpectator
): Promise<ConnectedPlayer> {
    const socket = io("http://localhost:3005");

    socket.emit("player/join", {
        gameId,
        playerName
    });

    if (global.OPENED_SOCKETS) {
        global.OPENED_SOCKETS.push(socket);
    } else {
        global.OPENED_SOCKETS = [socket];
    }

    const handSubject = new BehaviorSubject<string | undefined>(undefined);

    const listener = jest.fn().mockImplementation((respondWithHand: (hand: string) => void) => {
        const handToRespond = handSubject.getValue();

        if (handToRespond) {
            respondWithHand(handToRespond);

            handSubject.next(undefined);
        } else {
            const subscription = new Subscription();

            subscription.add(handSubject.subscribe((updatedHandToRespond) => {
                if (updatedHandToRespond) {
                    respondWithHand(updatedHandToRespond);

                    subscription.unsubscribe();
                    handSubject.next(undefined);
                }
            }));

        }
    });

    socket.on("player/hand:request", listener);

    await spectator?.waitForStatus(({status}) => ["spectator_added", "player_added"].includes(status));

    return {
        "disconnect": () => socket.disconnect(),
        "respondWithHand": (hand: string) => {
            handSubject.next(hand);
        },
        "fastForwardTimer": () => {
            handSubject.next("INTERNAL_FORWARD_HAND_TIMER");
        },
        "handRequestListener": listener
    };
}
