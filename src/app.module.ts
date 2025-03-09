import {Module} from "@nestjs/common";

import {OrchestratorModule} from "./orchestrator/orchestrator.module";
import {LoggerModule} from "./logger/logger.module";

@Module({
    "controllers": [],
    "imports": [OrchestratorModule, LoggerModule]
})
export class AppModule {}
