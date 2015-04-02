var glob = require('glob');
var JasmineLogger = require('./JasmineLogger');
var Utils = require('./Utils');
var Jasmine = require('jasmine');
var argv = require('yargs').usage('Usage: $0 --settings [settings file]').demand(['settings']).argv;
var logger = JasmineLogger('Jasmine Runner');
// Load settings
var settings = Utils.loadSettings(argv.settings);
// Create an Jasmine instance
var jasmine = new Jasmine({ projectBaseDir: settings.BasePath });
// Add helpers to jasmine
settings.Helpers.forEach(function (pattern) {
    glob.sync(pattern, { nodir: true }).forEach(function (f) {
        jasmine.addSpecFile(f);
    });
});
// Add specs to jasmine
settings.Specs.forEach(function (pattern) {
    glob.sync(pattern, { nodir: true }).forEach(function (f) {
        jasmine.addSpecFile(f);
    });
});
// Run the jasmine specs
jasmine.execute();
//# sourceMappingURL=JasmineRunner.js.map