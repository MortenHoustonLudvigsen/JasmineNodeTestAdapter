var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: 'console',
            layout: {
                type: 'pattern',
                pattern: '%p [%c]: %m'
            }
        }
    ]
});
function JasmineLogger(category) {
    return log4js.getLogger(category);
}
module.exports = JasmineLogger;
//# sourceMappingURL=JasmineLogger.js.map