import {EventsHandler, ICommand, IEvent, IEventHandler} from "@nestjs/cqrs";

import {LoggerService} from "../../logger/logger.service";

export class ExceptionEvent {
    constructor (
        public readonly error: Error,
        public readonly context: ICommand | IEvent
    ) {}
}

@EventsHandler(ExceptionEvent)
export class ExceptionEventHandler implements IEventHandler<ExceptionEvent> {
    constructor (
        private readonly loggerService: LoggerService
    ) {}

    handle (event: ExceptionEvent) {
        this.loggerService.error(event.error.message, event.error.stack, event.context.constructor.name);
    }
}
