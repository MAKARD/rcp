import {LoggerService as ILoggerService, Injectable, ConsoleLogger} from "@nestjs/common";

@Injectable()
export class LoggerService extends ConsoleLogger implements ILoggerService {}
