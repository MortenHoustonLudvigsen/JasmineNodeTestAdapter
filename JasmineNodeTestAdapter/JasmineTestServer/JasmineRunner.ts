import path = require('path');
import glob = require('glob');
import JasmineLogger = require('./JasmineLogger');
import Utils = require('./Utils');
var Jasmine = require('jasmine');

var argv = require('yargs')
    .usage('Usage: $0 --settings [settings file]')
    .demand(['settings'])
    .argv;

var logger = JasmineLogger('Jasmine Runner');

// Load settings
var settings = Utils.loadSettings(argv.settings);

// Create an Jasmine instance
var jasmine = new Jasmine({ projectBaseDir: settings.BasePath });

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

// Run the jasmine specs
jasmine.execute();
