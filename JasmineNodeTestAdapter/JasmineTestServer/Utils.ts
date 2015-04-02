import path = require('path');
import extend = require('extend');
import Settings = require('./Settings');
import Constants = require('./Constants');
import TextFile = require('../TestServer/TextFile');

export function loadSettings(settingsFile: string): Settings {
    var settings = <Settings>extend(Constants.defaultSettings, TextFile.readJson(settingsFile));

    // Use the directory of the settings file if settings.BasePath is not specified
    settings.BasePath = settings.BasePath || path.dirname(settingsFile);

    // Resolve paths to full paths
    settings.Helpers = settings.Helpers.map(pattern => path.resolve(settings.BasePath, pattern));
    settings.Specs = settings.Specs.map(pattern => path.resolve(settings.BasePath, pattern));
    settings.Watch = settings.Watch.map(pattern => path.resolve(settings.BasePath, pattern));

    // Watch helpers and specs as well
    settings.Watch = settings.Watch.concat(settings.Helpers).concat(settings.Specs);

    return settings;
}
