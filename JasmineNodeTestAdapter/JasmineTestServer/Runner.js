var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var path = require('path');
var child_process = require('child_process');
var events = require('events');
function quoteArg(argument) {
    argument = argument || '';
    if (!argument || /\s|"/.test(argument)) {
        argument = argument.replace(/(\\+)"/g, '$1$1"');
        argument = argument.replace(/(\\+)$/, '$1$1');
        argument = argument.replace(/"/g, '\\"');
        argument = '"' + argument + '"';
    }
    return argument;
}
var Runner = (function (_super) {
    __extends(Runner, _super);
    function Runner(name, settingsFile, batchInterval, server) {
        _super.call(this);
        this.name = name;
        this.settingsFile = settingsFile;
        this.batchInterval = batchInterval;
        this.server = server;
        this.isRunning = false;
    }
    Runner.prototype.schedule = function () {
        var _this = this;
        if (!this.isRunning) {
            clearTimeout(this.scheduleTimeout);
            this.scheduleTimeout = setTimeout(function () { return _this.run(); }, this.batchInterval);
        }
        else {
            clearTimeout(this.scheduleTimeout);
            this.scheduleTimeout = setTimeout(function () { return _this.schedule(); }, this.batchInterval);
        }
    };
    Runner.prototype.stop = function () {
        clearTimeout(this.scheduleTimeout);
    };
    Runner.prototype.run = function () {
        var _this = this;
        if (this.isRunning) {
            this.schedule();
            return;
        }
        this.isRunning = true;
        clearTimeout(this.scheduleTimeout);
        var options = { stdio: 'inherit' };
        var args = [
            path.join(__dirname, 'JasmineRunner.js'),
            '--name',
            this.name,
            '--port',
            this.server.address.port.toString(),
            '--settings',
            this.settingsFile
        ].map(quoteArg);
        child_process.spawn(process.execPath, args, options).on('exit', function (code) {
            _this.isRunning = false;
            _this.emit('exit', code);
        });
    };
    return Runner;
})(events.EventEmitter);
module.exports = Runner;
//# sourceMappingURL=Runner.js.map