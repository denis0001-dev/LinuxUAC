import pty from "node-pty";
import child_process from "child_process"

let program = process.argv[2]
let args = process.argv.slice(3, process.argv.length)
console.info(`spawn ${program} with args: ${JSON.stringify(args)}`)

function testPty() {
    let ptyProcess = pty.spawn(program, args)
    ptyProcess.on('data', (e) => console.log(e));
    ptyProcess.on('exit', () => { process.exit(0) });
}

function testChildProcess() {
    let childProcess = child_process.spawn(program, args, { stdio: 'inherit' })
    // childProcess.stdout?.on('data', (e) => console.log(e));
    // childProcess.stderr?.on('data', (e) => console.error(e));
    // childProcess.on('close', () => { console.info('close'); process.exit(0) });
}

// testPty();
testChildProcess()