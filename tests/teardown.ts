import {kill} from "node:process";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace global {
    export let TEST_SERVER_PID: number | undefined;
}

module.exports = function teardown () {
    if (global.TEST_SERVER_PID) {
        console.log("kill ", global.TEST_SERVER_PID);
        kill(global.TEST_SERVER_PID);
    }
};
