var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var path = require('path');
var TestServer = require('../TestServer/TestServer');
var JasmineLogger = require('./JasmineLogger');
var Server = (function (_super) {
    __extends(Server, _super);
    function Server(name, settings) {
        var _this = this;
        _super.call(this, name);
        this.logger = JasmineLogger('Jasmine Server');
        if (settings.Traits) {
            var traits = settings.Traits.map(function (trait) { return typeof trait === 'string' ? { name: trait } : trait; });
            this.loadExtensions({ getTraits: function (spec, server) { return traits; } });
        }
        if (settings.Extensions) {
            try {
                this.loadExtensions(path.resolve(settings.Extensions));
            }
            catch (e) {
                this.logger.error('Failed to load extensions from ' + settings.Extensions + ': ' + e.message);
            }
        }
        this.once('listening', function () { return _this.logger.info('Started - port:', _this.address.port); });
        this.start();
    }
    Server.prototype.onError = function (error, connection) {
        this.logger.error(error);
    };
    Server.prototype.testRunStarted = function () {
        this.logger.info('Test run start');
        _super.prototype.testRunStarted.call(this);
    };
    Server.prototype.testRunCompleted = function (specs) {
        this.logger.info('Test run complete');
        _super.prototype.testRunCompleted.call(this, specs);
    };
    return Server;
})(TestServer);
module.exports = Server;
//# sourceMappingURL=Server.js.map