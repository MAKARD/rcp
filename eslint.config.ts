import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import nodePlugin from "eslint-plugin-n";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import pluginJest from "eslint-plugin-jest";
import {createTypeScriptImportResolver} from "eslint-import-resolver-typescript";
// @ts-expect-error lack of typings
import importPlugin from "eslint-plugin-import";

// eslint-disable-next-line import/no-default-export
export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    stylisticTs.configs["all-flat"],
    nodePlugin.configs["flat/recommended-module"],
    importPlugin.flatConfigs.recommended,
    {
        "plugins": {"jest": pluginJest},
        "languageOptions": {
            "globals": pluginJest.environments.globals.globals,
            "parserOptions": {
                "projectService": true
            }
        },
        "settings": {
            "import-x/resolver-next": [
                createTypeScriptImportResolver({
                    "alwaysTryTypes": true
                })
            ],
            "import/resolver": {
                "typescript": {} // this loads <rootdir>/tsconfig.json to eslint
            }
        },
        "rules": {
            "n/no-missing-import": "off",
            "n/no-unpublished-import": "off",
            "no-multiple-empty-lines": ["error", {
                "max": 1,
                "maxEOF": 0
            }],
            "@typescript-eslint/no-shadow": "error",
            "no-path-concat": "error",
            "comma-dangle": "error",
            "no-extend-native": "error",
            "no-return-assign": "error",
            "no-floating-decimal": "error",
            "@typescript-eslint/no-unused-vars": ["error", {
                "ignoreRestSiblings": true
            }],
            "no-undef-init": "error",
            "radix": "off",
            "semi-spacing": "error",
            "no-useless-escape": "error",
            "no-extra-semi": "error",
            "no-irregular-whitespace": "error",
            "no-unexpected-multiline": "error",
            "semi": ["error", "always"],
            "key-spacing": ["error", {"beforeColon": false,
                "afterColon": true,
                "mode": "strict"}],
            "comma-spacing": ["error", {"before": false,
                "after": true}],
            "rest-spread-spacing": "error",
            "template-curly-spacing": "error",
            "block-spacing": "error",
            "arrow-spacing": ["error", {"before": true,
                "after": true}],
            "space-in-parens": ["error", "never"],
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    "selector": "variable",
                    "format": ["camelCase", "PascalCase", "UPPER_CASE"]
                },
                {
                    "selector": "function",
                    "format": ["camelCase", "PascalCase"]
                },
                {
                    "selector": "typeLike",
                    "format": ["PascalCase"]
                }
            ],
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/return-await": ["error", "in-try-catch"],
            "@stylistic/ts/type-annotation-spacing": ["error", {
                "after": true
            }],
            "eol-last": ["error", "always"],
            "no-trailing-spaces": ["error"],
            "padding-line-between-statements": ["error",
                {
                    "blankLine": "always",
                    "prev": "*",
                    "next": "return"
                },
                {
                    "blankLine": "always",
                    "prev": "block-like",
                    "next": "*"
                }
            ],
            "@stylistic/ts/member-delimiter-style": ["error", {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }],
            "max-lines": ["error", 200],
            "import/no-default-export": "error",
            "import/newline-after-import": ["error", {"count": 1}],
            "import/order": ["error", {
                "groups": [
                    "builtin", "external", "parent", "sibling", "index"
                ],
                "newlines-between": "always",
                "pathGroupsExcludedImportTypes": ["builtin"]
            }],
            "jest/no-alias-methods": "error",
            "jest/expect-expect": "error",
            "jest/no-commented-out-tests": "error",
            "jest/valid-title": [
                "error",
                {
                    "mustMatch": {
                        "it": [/^should/u.source, "The name of the test must begin with should"]
                    }
                }
            ],
            "jest/no-restricted-matchers": [
                "error",
                {
                    "toBeFalsy": null,
                    "toBeTruthy": null
                }
            ],
            "jest/prefer-to-be": "error",
            "jest/no-standalone-expect": ["error", {
                "additionalTestBlockFunctions": ["then", "when", "and", "given"]
            }],
            "@typescript-eslint/array-type": ["error", {"default": "generic"}],
            "import/no-duplicates": "error",
            "import/no-cycle": "error",
            "max-len": ["error", {
                "ignoreUrls": true,
                "code": 120
            }],
            "no-empty": "error",
            "no-multi-spaces": "error",
            "no-constant-binary-expression": "error",
            "no-extra-boolean-cast": "error",
            "prefer-promise-reject-errors": "error",
            "@typescript-eslint/prefer-string-starts-ends-with": "error",
            "@typescript-eslint/prefer-optional-chain": "error",
            "@typescript-eslint/prefer-as-const": "error",
            "@typescript-eslint/no-duplicate-enum-values": "error",
            "@typescript-eslint/no-non-null-assertion": "error",
            "brace-style": ["error", "1tbs", {"allowSingleLine": false}],
            "curly": ["error", "all"],
            "function-paren-newline": ["error", "multiline-arguments"],
            "no-restricted-globals": ["error",
                {
                    "name": "setTimeout",
                    "message": "Avoid using timers"
                }
            ],
            "no-restricted-properties": ["error",
                {
                    "object": "global",
                    "property": "setTimeout",
                    "message": "Avoid using timers"
                }
            ],
            "no-lonely-if": "error"
        }
    }
);
