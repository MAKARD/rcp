import * as kill from "tree-kill";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace global {
    export let TEST_SERVER_PID: number | undefined;
}

module.exports = function teardown () {
    if (global.TEST_SERVER_PID) {
        kill(global.TEST_SERVER_PID);
    }
};
