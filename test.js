const {spawn} = require("child_process");

let iteration = 0;

function start() {
    iteration++
    const child = spawn("npm", ["run", "test"]);

    // global.TEST_SERVER_PID = child.pid;
    
    let error = false
    child.stderr.on("data", (data) => {
        if (data.toString().includes("FAIL")) {
            error = true;
        }
    });
    
    child.addListener("exit", () => {
        if (error) {
            console.log("FAIL", "number of iterations", iteration)
            return;
        }
    
        console.log('ITERATION', iteration)
        start()
    })
}

start();