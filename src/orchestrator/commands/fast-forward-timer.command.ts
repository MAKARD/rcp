import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";

import {TimerRepository} from "../repositories/timer.repository";

export class FastForwardTimerCommand {
    constructor (
        public readonly gameId: string
    ) {}
}

@CommandHandler(FastForwardTimerCommand)
export class FastForwardTimerCommandHandler implements ICommandHandler<FastForwardTimerCommand> {
    constructor (
        private readonly timerRepository: TimerRepository
    ) {}

    async execute (command: FastForwardTimerCommand) {
        const timer = this.timerRepository.findOneByIdOrFail(command.gameId);

        timer.fastForward();
    }
}
