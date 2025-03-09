#!/bin/bash
set -e

BOLD='\033[1m'
GREEN='\033[42m'
BLUE='\033[44m'
RESET='\033[0m'

LABEL_PROCESSING="${BLUE}${BOLD} LINT ${RESET}"
LABEL_SUCCESS="${GREEN}${BOLD} LINT ${RESET}"

echo -e "${LABEL_PROCESSING} Checking TypeScript..."
tsc --project tsconfig.json --noEmit
echo -e "${LABEL_SUCCESS} TypeScript checked"

echo -e "${LABEL_PROCESSING} Checking ESLint..."
eslint . --ignore-pattern 'coverage' --ignore-pattern 'dist' --ignore-pattern '.nyc_output'
echo -e "${LABEL_SUCCESS} ESLint checked"

echo -e "${LABEL_PROCESSING} Checking spelling..."
cspell './src/**/*.ts' './tests/**/*' './scripts/**/*' --cache
echo -e "${LABEL_SUCCESS} Spelling checked"

echo -e "${LABEL_PROCESSING} Checking TODOs..."
leasot "**/*.ts" --ignore "node_modules,dist" --reporter markdown -x > TODO.md
leasot "**/*.ts" --ignore "node_modules,dist" --reporter table -x
echo -e "${LABEL_SUCCESS} TODOs listed in TODO.md"
