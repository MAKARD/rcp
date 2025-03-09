if (process.env.TEST_DETECT_LEAKS) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("leaked-handles").set({
        "debugSockets": true,
        "fullStack": true,
        "timeout": 30000
    });
}

import {spawn} from "node:child_process";
import * as path from "node:path";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace global {
    export let TEST_SERVER_PID: number | undefined;
}

// Remove ANSI clear screen sequences
const safeOutput = (text: string) => {
    return text
        /* eslint-disable no-control-regex */
        .replace(/\u001b\[\d*J/g, "")
        .replace(/\u001b\[H/g, "")
        .replace(/\n+$/, "")
        .trim();
    /* eslint-enable no-control-regex */
};

module.exports = function setup () {
    return new Promise<void>((resolve) => {
        console.log("\n");

        if (process.env.TEST_DEBUG_LOGS) {
            console.log("\x1b[1m\x1b[48;2;255;165;0m STARTING SEVER ON PORT 3005 \x1b[0m");
        }

        let args: [string, Array<string>];

        if (process.env.TEST_DEBUG_LOGS) {
            args = [
                "ts-node",
                ["./src/main.ts"]
            ];
        } else {
            args = [
                "nyc",
                ["ts-node", "./src/main.ts"]
            ];
        }

        const child = spawn(...args, {
            "cwd": path.join(__dirname, "/.."),
            "env": {
                ...process.env,
                "PORT": "3005"
            }
        });

        global.TEST_SERVER_PID = child.pid;

        child.stderr.on("data", (data) => {
            const errorLabel = "\x1b[1m\x1b[41m SERVER ERROR \x1b[0m";

            if (process.env.TEST_DEBUG_LOGS) {
                console.error(errorLabel, data.toString());
            } else {
                console.error(errorLabel, "Run npm run test:debug to see details");
            }
        });

        child.stdout.on("data", (data) => {
            const stringsToPrint = safeOutput(data.toString());

            if (stringsToPrint && process.env.TEST_DEBUG_LOGS) {
                stringsToPrint
                    .split("\n")
                    .forEach((stringToPrint) => console.log("\x1b[1m\x1b[104m SERVER LOG \x1b[0m", stringToPrint));
            }

            if (data.toString().includes("Nest application successfully started")) {
                if (process.env.TEST_DEBUG_LOGS) {
                    console.log("\x1b[1m\x1b[48;2;255;165;0m RECEIVED SEVER STARTED SIGNAL \x1b[0m");
                }

                resolve();
            }
        });
    });
};
