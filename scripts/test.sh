#!/bin/bash
set -e

BOLD='\033[1m'
GREEN='\033[42m'
BLUE='\033[44m'
ORANGE='\033[48;2;255;165;0m'
RESET='\033[0m'

LABEL_PROCESSING="${BLUE}${BOLD} TEST ${RESET}"
LABEL_SUCCESS="${GREEN}${BOLD} TEST ${RESET}"
LABEL_WARN="${ORANGE}${BOLD} TEST ${RESET}"

echo -e "${LABEL_PROCESSING} Preparing files..."
rm -rf coverage
rm -rf .nyc_output
rm -rf node_modules/.cache/nyc
echo -e "${LABEL_SUCCESS} Files prepared"

echo -e "${LABEL_PROCESSING} Running tests..."
# jest tests/scenarios/game/implementation/determining-results.int.test.ts
jest
echo -e "${LABEL_SUCCESS} Tests passed"

if [ "$TEST_DEBUG_LOGS" != "true" ]; then
    echo -e "${LABEL_PROCESSING} Getting coverage..."
    nyc report
    mv coverage/tests/coverage-final.json coverage/tests-coverage-final.json
    nyc merge coverage coverage/coverage-final.json
    rm coverage/tests-coverage-final.json
    istanbul report html
    istanbul report text-summary
    echo -e "${LABEL_SUCCESS} Coverage ready"
else
    echo -e "${LABEL_WARN} Skipping coverage because of debugging"
fi
