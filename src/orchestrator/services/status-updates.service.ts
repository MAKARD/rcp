import {Injectable} from "@nestjs/common";

interface StatusUpdate {
    "gameId": string;
    "data": {
        "status": string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "event": Record<string, any>;
    };
}

export interface BroadcastDelegate {
    broadcastTo(gameId: string, data: unknown): void;
}

@Injectable()
export class StatusUpdatesService {
    private statusUpdatesQueue: Array<StatusUpdate> = [];

    private isProcessingItem = false;

    private broadcastDelegate: BroadcastDelegate | undefined;

    setBroadcastDelegate (delegate: BroadcastDelegate) {
        this.broadcastDelegate = delegate;
    }

    publish (gameId: string, data: StatusUpdate["data"]) {
        this.statusUpdatesQueue.push({
            data,
            gameId
        });

        this.processQueue();
    }

    private async processQueue () {
        if (!this.broadcastDelegate) {
            return;
        }

        if (this.isProcessingItem) {
            return;
        }

        this.isProcessingItem = true;

        let event = this.statusUpdatesQueue.shift();

        while (event) {
            this.broadcastDelegate.broadcastTo(event.gameId, event.data);

            // eslint-disable-next-line no-restricted-globals
            await new Promise((resolve) => setTimeout(resolve, 10));

            event = this.statusUpdatesQueue.shift();
        }

        this.isProcessingItem = false;
    }
}
