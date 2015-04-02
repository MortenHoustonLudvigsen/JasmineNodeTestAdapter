var path = require('path');
var extend = require('extend');
var Constants = require('./Constants');
var TextFile = require('../TestServer/TextFile');
function loadSettings(settingsFile) {
    var settings = extend(Constants.defaultSettings, TextFile.readJson(settingsFile));
    // Use the directory of the settings file if settings.BasePath is not specified
    settings.BasePath = settings.BasePath || path.dirname(settingsFile);
    // Resolve paths to full paths
    settings.Helpers = settings.Helpers.map(function (pattern) { return path.resolve(settings.BasePath, pattern); });
    settings.Specs = settings.Specs.map(function (pattern) { return path.resolve(settings.BasePath, pattern); });
    settings.Watch = settings.Watch.map(function (pattern) { return path.resolve(settings.BasePath, pattern); });
    // Watch helpers and specs as well
    settings.Watch = settings.Watch.concat(settings.Helpers).concat(settings.Specs);
    return settings;
}
exports.loadSettings = loadSettings;
//# sourceMappingURL=Utils.js.map