// import "leaked-handles";

import {spawn} from "node:child_process";
import * as path from "node:path";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace global {
    export let TEST_SERVER_PID: number | undefined;
}

module.exports = function setup () {
    return new Promise<void>((resolve) => {
        if (process.env.TEST_DEBUG_LOGS) {
            console.log("\n", "\x1b[1m\x1b[48;2;255;165;0m STARTING SEVER ON PORT 3005 \x1b[0m");
        }

        const child = spawn("npm", ["run", "start:test"], {
            "env": {
                ...process.env,
                "PORT": "3005"
            },
            "cwd": path.join(__dirname, "/..")
        });

        global.TEST_SERVER_PID = child.pid;

        child.stderr.on("data", (data) => {
            if (process.env.TEST_DEBUG_LOGS) {
                console.log("\x1b[1m\x1b[41m SERVER ERROR \x1b[0m", data.toString());
            }
        });

        child.stdout.on("data", (data) => {
            // Remove ANSI clear screen sequences
            const safeOutput = (text: string) => {
                // eslint-disable-next-line no-control-regex
                return text.replace(/\u001b\[\d*J/g, "").replace(/\u001b\[H/g, "");
            };

            const stringToPrint = safeOutput(data.toString());

            if (stringToPrint && process.env.TEST_DEBUG_LOGS) {
                console.log("\x1b[1m\x1b[104m SERVER LOG \x1b[0m", stringToPrint);
            }

            if (data.toString().includes("Nest application successfully started")) {
                if (process.env.TEST_DEBUG_LOGS) {
                    console.log("\x1b[1m\x1b[48;2;255;165;0m RECEIVED SEVER STARTED SIGNAL \x1b[0m", "\n");
                }

                resolve();
            }
        });
    });
};
