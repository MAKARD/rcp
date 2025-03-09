import {createJsWithTsPreset, type JestConfigWithTsJest} from "ts-jest";

const presetConfig = createJsWithTsPreset({
    "tsconfig": {
        "noEmit": true
    }
});

const jestConfig: JestConfigWithTsJest = {
    ...presetConfig,
    "collectCoverage": !process.env.TEST_DEBUG_LOGS,
    "collectCoverageFrom": ["<rootDir>/tests/**/*.ts"],
    "coverageDirectory": "<rootDir>/coverage/tests",
    "coverageReporters": ["json"],
    "globalSetup": "./tests/setup.ts",
    "globalTeardown": "./tests/teardown.ts",
    "setupFilesAfterEnv": ["./tests/setup-after-env.ts"],
    "testMatch": ["<rootDir>/tests/**/*.test.ts"],
    "testTimeout": 10000,
    "transformIgnorePatterns": ["^.+\\.js$"]
};

// eslint-disable-next-line import/no-default-export
export default jestConfig;
