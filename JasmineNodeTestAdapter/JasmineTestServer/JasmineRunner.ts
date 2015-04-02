import path = require('path');
import glob = require('glob');
import TestNetServer = require('../TestServer/TestNetServer');
import JasmineLogger = require('./JasmineLogger');
import JasmineInstumentation = require('./JasmineInstumentation');
import JasmineReporter = require('./JasmineReporter');
import Utils = require('./Utils');
var Jasmine = require('jasmine');

var logger = JasmineLogger('Jasmine Runner');

var argv = require('yargs')
    .usage('Usage: node JasmineRunner.js [options]')
    .demand(['settings', 'port'])
    .describe('name', 'The name of the test container')
    .describe('port', 'The test server port')
    .describe('settings', 'The settings file (JasmineNodeTestAdapter.json)')
    .argv;

var name = argv.name || '';
var port = argv.port;

// Load settings
var settings = Utils.loadSettings(argv.settings);

// Create a TestNetServer, that can report test results to the test server
var server = new TestNetServer(name, port);

// Create an Jasmine instance
var jasmine = new Jasmine({ projectBaseDir: settings.BasePath });

// Wrap jasmine functions to get source information
JasmineInstumentation.wrapFunctions(jasmine.env);

// Add helpers to jasmine
settings.Helpers.forEach(pattern => {
    glob.sync(pattern, { nodir: true }).forEach(f => {
        jasmine.addSpecFile(f);
    });
});

// Add specs to jasmine
settings.Specs.forEach(pattern => {
    glob.sync(pattern, { nodir: true }).forEach(f => {
        jasmine.addSpecFile(f);
    });
});

var reporter = new JasmineReporter(server, settings.BasePath);
jasmine.addReporter(reporter);

try {
    // Run the jasmine specs
    jasmine.execute();
} catch (e) {
    // If there is an unhandled error report it as a failed test
    reporter.jasmineFailed(e);
}
