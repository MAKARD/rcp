import {createJsWithTsPreset, type JestConfigWithTsJest} from "ts-jest";

const presetConfig = createJsWithTsPreset({
    "tsconfig": {
        "noEmit": true
    }
});

const jestConfig: JestConfigWithTsJest = {
    ...presetConfig,
    "setupFilesAfterEnv": [
        "./tests/setup-after-env.ts"
    ],
    "globalSetup": "./tests/setup.ts",
    "globalTeardown": "./tests/teardown.ts",
    "modulePathIgnorePatterns": ["<rootDir>/.*/__mocks__"],
    "transformIgnorePatterns": ["^.+\\.js$"],
    "testMatch": [
        "<rootDir>/tests/**/*.test.ts"
    ],
    "collectCoverage": true,
    "coverageReporters": ["none"],
    "collectCoverageFrom": [
        "<rootDir>/**/*.ts"
    ]
};

// eslint-disable-next-line import/no-default-export
export default jestConfig;
