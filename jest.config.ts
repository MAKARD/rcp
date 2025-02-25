import {createJsWithTsPreset, type JestConfigWithTsJest} from "ts-jest";

const presetConfig = createJsWithTsPreset({
    "tsconfig": "tsconfig.node.json"
});

const jestConfig: JestConfigWithTsJest = {
    ...presetConfig,
    "globalSetup": "./tests/setup.ts",
    "globalTeardown": "./tests/teardown.ts",
    "modulePathIgnorePatterns": ["<rootDir>/.*/__mocks__"],
    "transform": {
        ...presetConfig.transform
    }
};

// eslint-disable-next-line import/no-default-export
export default jestConfig;
