import {Observable, Subscription} from "rxjs";

import {CreatedSpectator, createSpectator} from "../actions/create-spectator.action";

export function gameSpectator (gameId: Observable<string>): Pick<CreatedSpectator, "waitForStatus"> {
    let spectator: CreatedSpectator | undefined;

    const subscription = new Subscription();

    beforeAll(async () => {
        await new Promise<void>((resolve) => {
            subscription.add(
                gameId.subscribe(async (id) => {
                    if (!id) {
                        return;
                    }

                    spectator = await createSpectator(id);

                    resolve();
                })
            );
        });
    });

    afterAll(() => {
        subscription.unsubscribe();

        spectator?.disconnect();
    });

    return {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        "waitForStatus": (...args) => spectator!.waitForStatus(...args)
    };
}
