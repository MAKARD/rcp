import {Injectable} from "@nestjs/common";

import {Timer} from "../interfaces/timer.interface";
import {TimerModel} from "../models/timer.model";

@Injectable()
export class TimerRepository {
    private timers = new Map<string, Timer>();

    findOneById (id: string): Timer | undefined {
        const timer = this.timers.get(id);

        return timer;
    }

    findOneByIdOrFail (id: string): Timer {
        const timer = this.timers.get(id);

        if (!timer) {
            throw new Error("Not found");
        }

        return timer;
    }

    createOneById (id: string): Timer {
        const existingTimer = this.timers.get(id);

        if (existingTimer) {
            existingTimer.reset();

            this.timers.delete(existingTimer.id);
        }

        const timer = new TimerModel(id);

        this.timers.set(id, timer);

        return timer;
    }
}
