import Server = require('./Server');
import Runner = require('./Runner');
import Utils = require('./Utils');

var argv = require('yargs')
    .usage('Usage: node Start.js [options]')
    .demand(['settings'])
    .describe('name', 'The name of the test container')
    .describe('settings', 'The settings file (JasmineNodeTestAdapter.json)')
    .describe('singleRun', 'Run tests only once')
    .argv;

var name = argv.name || '';
var settings = Utils.loadSettings(argv.settings);

var server = new Server(name, settings);
var runner = new Runner(name, argv.settings, settings.BatchInterval, server);

if (argv.singleRun) {
    runner.on('exit', code => process.exit(code));
} else {
    var gaze = require('gaze');
    gaze(settings.Watch, function (err, watcher) {
        this.on('all',(event, filepath) => runner.schedule());
    });
}

server.once('listening',() => runner.run());
server.start();
