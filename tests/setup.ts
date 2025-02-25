import {spawn} from "node:child_process";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace global {
    export let TEST_SERVER_PID: number | undefined;
}

module.exports = function setup () {
    return new Promise<void>((resolve) => {
        const child = spawn("npm", ["run", "start:dev"], {
            "env": {
                ...process.env,
                "PORT": "3005"
            }
        });

        global.TEST_SERVER_PID = child.pid;

        resolve();

        console.log("spawn ", global.TEST_SERVER_PID);

    });
};
