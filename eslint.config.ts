/* eslint-disable max-lines */
import eslint from "@eslint/js";
import tseslint, {ConfigArray} from "typescript-eslint";
import nodePlugin from "eslint-plugin-n";
import stylistic from "@stylistic/eslint-plugin";
import pluginJest from "eslint-plugin-jest";
import {createTypeScriptImportResolver} from "eslint-import-resolver-typescript";
// @ts-expect-error types issues
import importPlugin from "eslint-plugin-import";

const config: ConfigArray = tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    stylistic.configs.all,
    nodePlugin.configs["flat/recommended-module"],
    importPlugin.flatConfigs.recommended,
    {
        "languageOptions": {
            "globals": pluginJest.environments.globals.globals,
            "parserOptions": {
                "projectService": true
            }
        },
        "linterOptions": {
            "reportUnusedDisableDirectives": "error"
        },
        "plugins": {"jest": pluginJest},
        "rules": {
            "@stylistic/array-element-newline": [
                "error",
                {
                    "consistent": true,
                    "multiline": true
                }
            ],
            "@stylistic/dot-location": ["error", "property"],
            "@stylistic/function-call-argument-newline": [
                "error",
                "consistent"
            ],
            "@stylistic/function-paren-newline": ["error", "consistent"],
            "@stylistic/lines-around-comment": [
                "error",
                {
                    "allowBlockStart": true
                }
            ],
            "@stylistic/member-delimiter-style": [
                "error",
                {
                    "multiline": {
                        "delimiter": "semi",
                        "requireLast": true
                    },
                    "singleline": {
                        "delimiter": "semi",
                        "requireLast": false
                    }
                }
            ],
            "@stylistic/multiline-comment-style": "off",
            "@stylistic/object-curly-newline": [
                "error",
                {
                    "ExportDeclaration": {
                        "consistent": true,
                        "multiline": true
                    },
                    "ImportDeclaration": {
                        "consistent": true,
                        "multiline": true
                    },
                    "ObjectExpression": {
                        "consistent": true,
                        "multiline": true
                    },
                    "ObjectPattern": {
                        "consistent": true,
                        "multiline": true
                    }
                }
            ],
            "@stylistic/padded-blocks": [
                "error",
                "never"
            ],
            "@stylistic/type-annotation-spacing": [
                "error",
                {
                    "after": true
                }
            ],
            "@typescript-eslint/array-type": [
                "error",
                {"default": "generic"}
            ],
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/member-ordering": [
                "error",
                {
                    "default": [
                        "signature",
                        "public-static-field",
                        "protected-static-field",
                        "private-static-field",
                        "public-instance-field",
                        "protected-instance-field",
                        "private-instance-field",
                        "constructor",
                        "public-instance-method",
                        "protected-instance-method",
                        "private-instance-method"
                    ]
                }
            ],
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    "format": [
                        "camelCase",
                        "PascalCase",
                        "UPPER_CASE"
                    ],
                    "selector": "variable"
                },
                {
                    "format": [
                        "camelCase",
                        "PascalCase"
                    ],
                    "selector": "function"
                },
                {
                    "format": ["PascalCase"],
                    "selector": "typeLike"
                }
            ],
            "@typescript-eslint/no-duplicate-enum-values": "error",
            "@typescript-eslint/no-non-null-assertion": "error",
            "@typescript-eslint/no-shadow": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "ignoreRestSiblings": true
                }
            ],
            "@typescript-eslint/prefer-as-const": "error",
            "@typescript-eslint/prefer-optional-chain": "error",
            "@typescript-eslint/prefer-string-starts-ends-with": "error",
            "@typescript-eslint/return-await": [
                "error",
                "in-try-catch"
            ],
            "arrow-spacing": [
                "error",
                {
                    "after": true,
                    "before": true
                }
            ],
            "block-spacing": "error",
            "brace-style": [
                "error",
                "1tbs",
                {"allowSingleLine": false}
            ],
            "comma-dangle": "error",
            "comma-spacing": [
                "error",
                {
                    "after": true,
                    "before": false
                }
            ],
            "curly": [
                "error",
                "all"
            ],
            "eol-last": [
                "error",
                "always"
            ],
            "function-paren-newline": [
                "error",
                "multiline-arguments"
            ],
            "import/newline-after-import": [
                "error",
                {"count": 1}
            ],
            "import/no-cycle": "error",
            "import/no-default-export": "error",
            "import/no-duplicates": "error",
            "import/order": [
                "error",
                {
                    "groups": [
                        "builtin",
                        "external",
                        "parent",
                        "sibling",
                        "index"
                    ],
                    "newlines-between": "always",
                    "pathGroupsExcludedImportTypes": ["builtin"]
                }
            ],
            "jest/expect-expect": "error",
            "jest/no-alias-methods": "error",
            "jest/no-commented-out-tests": "error",
            "jest/no-restricted-matchers": [
                "error",
                {
                    "toBeFalsy": null,
                    "toBeTruthy": null
                }
            ],
            "jest/no-standalone-expect": [
                "error",
                {
                    "additionalTestBlockFunctions": [
                        "then",
                        "when",
                        "and",
                        "given"
                    ]
                }
            ],
            "jest/prefer-to-be": "error",
            "jest/valid-title": [
                "error",
                {
                    "mustMatch": {
                        "it": [
                            (/^should/u).source,
                            "The name of the test must begin with should"
                        ]
                    }
                }
            ],
            "key-spacing": [
                "error",
                {
                    "afterColon": true,
                    "beforeColon": false,
                    "mode": "strict"
                }
            ],
            "max-len": [
                "error",
                {
                    "code": 120,
                    "ignoreUrls": true
                }
            ],
            "max-lines": [
                "error",
                200
            ],
            "n/no-missing-import": "off",
            "n/no-unpublished-import": "off",
            "no-constant-binary-expression": "error",
            "no-empty": "error",
            "no-extend-native": "error",
            "no-extra-boolean-cast": "error",
            "no-extra-semi": "error",
            "no-floating-decimal": "error",
            "no-irregular-whitespace": "error",
            "no-lonely-if": "error",
            "no-multi-spaces": "error",
            "no-multiple-empty-lines": [
                "error",
                {
                    "max": 1,
                    "maxEOF": 0
                }
            ],
            "no-path-concat": "error",
            "no-restricted-globals": [
                "error",
                {
                    "message": "Avoid using timers",
                    "name": "setTimeout"
                }
            ],
            "no-restricted-properties": [
                "error",
                {
                    "message": "Avoid using timers",
                    "object": "global",
                    "property": "setTimeout"
                }
            ],
            "no-return-assign": "error",
            "no-trailing-spaces": "error",
            "no-undef-init": "error",
            "no-unexpected-multiline": "error",
            "no-useless-escape": "error",
            "padding-line-between-statements": [
                "error",
                {
                    "blankLine": "always",
                    "next": "return",
                    "prev": "*"
                },
                {
                    "blankLine": "always",
                    "next": "*",
                    "prev": "block-like"
                }
            ],
            "prefer-promise-reject-errors": "error",
            "radix": "off",
            "rest-spread-spacing": "error",
            "semi": [
                "error",
                "always"
            ],
            "semi-spacing": "error",
            "sort-keys": [
                "error",
                "asc",
                {
                    "caseSensitive": true,
                    "natural": false
                }
            ],
            "space-in-parens": [
                "error",
                "never"
            ],
            "template-curly-spacing": "error"
        },
        "settings": {
            "import-x/resolver-next": [
                createTypeScriptImportResolver({
                    "alwaysTryTypes": true
                })
            ],
            "import/resolver": {
                "typescript": {}
            }
        }
    }
);

// eslint-disable-next-line import/no-default-export
export default config;
