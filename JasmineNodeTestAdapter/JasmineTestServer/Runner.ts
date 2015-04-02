import path = require('path');
import child_process = require('child_process');
import events = require('events');
import Server = require('./Server');

function quoteArg(argument: string): string {
    argument = argument || '';
    if (!argument || /\s|"/.test(argument)) {
        argument = argument.replace(/(\\+)"/g, '$1$1"');
        argument = argument.replace(/(\\+)$/, '$1$1');
        argument = argument.replace(/"/g, '\\"');
        argument = '"' + argument + '"';
    }
    return argument;
}

class Runner extends events.EventEmitter {
    constructor(private name: string, private settingsFile: string, private batchInterval: number, private server: Server) {
        super();
    }

    private isRunning = false;
    private scheduleTimeout: NodeJS.Timer;

    schedule() {
        if (!this.isRunning) {
            clearTimeout(this.scheduleTimeout);
            this.scheduleTimeout = setTimeout(() => this.run(), this.batchInterval);
        } else {
            clearTimeout(this.scheduleTimeout);
            this.scheduleTimeout = setTimeout(() => this.schedule(), this.batchInterval);
        }
    }

    stop() {
        clearTimeout(this.scheduleTimeout);
    }

    private run() {
        this.isRunning = true;
        clearTimeout(this.scheduleTimeout);

        var options = { stdio: 'inherit' };

        var args = [
            path.join(__dirname, 'JasmineRunner.js'),
            '--name', this.name,
            '--port', this.server.address.port.toString(),
            '--settings', this.settingsFile
        ].map(quoteArg);

        child_process.spawn(process.execPath, args, options).on('exit', code => {
            this.isRunning = false;
            this.emit('exit', code);
        });
    }
}

export = Runner;
