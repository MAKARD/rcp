import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";

import {FastForwardTimerCommand} from "../impl/fast-forward-timer.command";
import {TimerRepository} from "../../repositories/timer.repository";

@CommandHandler(FastForwardTimerCommand)
export class FastForwardTimerHandler implements ICommandHandler<FastForwardTimerCommand> {
    constructor (
        private readonly timerRepository: TimerRepository
    ) {}

    async execute (command: FastForwardTimerCommand) {
        const timer = this.timerRepository.findOneByIdOrFail(command.gameId);

        timer.fastForward();
    }
}
