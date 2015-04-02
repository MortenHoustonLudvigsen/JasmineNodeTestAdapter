var util = require('util');
var TestReporter = require('../TestServer/TestReporter');
var Timer = require('./Timer');
var JasmineLogger = require('./JasmineLogger');
function isValidStackFrame(entry) {
    return (entry ? true : false) && !/[\/\\]jasmine-core[\/\\]/.test(entry) && !/[\/\\]JasmineTestServer[\/\\]/.test(entry);
}
function pruneStack(stack) {
    return stack.split(/\r\n|\n/).filter(function (frame) { return isValidStackFrame(frame); });
}
function getFailure(failure) {
    var expectation = {
        message: failure.message,
        passed: failure.passed,
        stack: {}
    };
    var messageLines = failure.message.split(/\r\n|\n/);
    var messageLineCount = messageLines.length;
    if (failure.stack) {
        var stack = pruneStack(failure.stack).slice(messageLines.length);
        stack.unshift(messageLines[0] || '');
        expectation.stack = { stack: stack.join('\n') };
    }
    else if (failure.stacktrace) {
        var stack = pruneStack(failure.stacktrace).slice(messageLines.length);
        stack.unshift(messageLines[0] || '');
        expectation.stack = { stacktrace: stack.join('\n') };
    }
    return expectation;
}
function skipLines(str, count) {
    return str.split(/\r\n|\n/).slice(count).join('\n');
}
function formatFailure(failure) {
    var result = failure.message;
    if (failure.stack && failure.stack.stack) {
        result += '\n' + skipLines(failure.stack.stack, 1);
    }
    if (failure.stack && failure.stack.stacktrace) {
        result += '\n' + skipLines(failure.stack.stacktrace, 1);
    }
    return result;
}
function isTopLevelSuite(suite) {
    return suite.description === 'Jasmine_TopLevel_Suite';
}
var JasmineReporter = (function () {
    function JasmineReporter(server, basePath) {
        this.server = server;
        this.basePath = basePath;
        this.logger = JasmineLogger('Jasmine Reporter');
        this.isRunning = false;
        this.originalConsoleFunctions = {
            log: console.log,
            debug: console.debug,
            info: console.info,
            warn: console.warn,
            error: console.error
        };
    }
    JasmineReporter.prototype.getSuiteList = function (result) {
        if (result.root || result.suite.root) {
            return [];
        }
        var suites = this.getSuiteList(result.suite);
        suites.push(result.suite.description);
        return suites;
    };
    JasmineReporter.prototype.replaceConsole = function () {
        var _this = this;
        ['log', 'debug', 'info', 'warn', 'error'].forEach(function (item) {
            console[item] = function () { return _this.testReporter.onOutput(_this.context, util.format.apply(util, arguments)); };
        });
    };
    JasmineReporter.prototype.restoreConsole = function () {
        var _this = this;
        ['log', 'debug', 'info', 'warn', 'error'].forEach(function (item) {
            console[item] = _this.originalConsoleFunctions[item];
        });
    };
    JasmineReporter.prototype.jasmineStarted = function (suiteInfo) {
        this.isRunning = true;
        // In this test adapter, there is only one context: Node.js
        // In the Karma Test Adapter there is a context per browser
        this.context = {
            name: 'Node.js'
        };
        this.currentSuite = {
            root: true,
            isSuite: true
        };
        this.testReporter = new TestReporter(this.server, this.basePath, this.logger, function (fileName) { return fileName; });
        this.testReporter.onTestRunStart();
        this.testReporter.onContextStart(this.context);
        this.replaceConsole();
    };
    JasmineReporter.prototype.jasmineDone = function () {
        this.restoreConsole();
        this.testReporter.onContextDone(this.context);
        this.testReporter.onTestRunComplete();
        this.isRunning = false;
    };
    JasmineReporter.prototype.jasmineFailed = function (error) {
        if (!this.isRunning) {
            this.jasmineStarted({ totalSpecsDefined: undefined });
        }
        this.testReporter.onError(this.context, error);
        this.jasmineDone();
    };
    JasmineReporter.prototype.suiteStarted = function (suite) {
        if (!isTopLevelSuite(suite)) {
            suite.isSuite = true;
            suite.suite = this.currentSuite;
            suite.startTime = Timer.now();
            this.currentSuite = suite;
            this.testReporter.onSuiteStart(this.context);
        }
    };
    JasmineReporter.prototype.suiteDone = function (suite) {
        if (!isTopLevelSuite(suite)) {
            suite.endTime = Timer.now();
            // In the case of xdescribe, only "suiteDone" is fired.
            // We need to skip that.
            if (this.currentSuite === suite) {
                this.currentSuite = suite.suite;
            }
            this.testReporter.onSuiteDone(this.context);
        }
    };
    JasmineReporter.prototype.specStarted = function (spec) {
        spec.suite = this.currentSuite;
        spec.startTime = Timer.now();
        this.testReporter.onSpecStart(this.context, {
            description: spec.description,
            id: spec.id
        });
    };
    JasmineReporter.prototype.specDone = function (spec) {
        spec.endTime = Timer.now();
        var failures = spec.failedExpectations ? spec.failedExpectations.map(function (exp) { return getFailure(exp); }) : [];
        this.testReporter.onSpecDone(this.context, {
            description: spec.description,
            id: spec.id,
            log: failures.map(function (failure) { return formatFailure(failure); }),
            skipped: spec.status === 'disabled' || spec.status === 'pending',
            success: spec.failedExpectations.length === 0,
            suite: this.getSuiteList(spec),
            time: spec.endTime - spec.startTime,
            startTime: spec.startTime,
            endTime: spec.endTime,
            source: spec.source,
            failures: failures
        });
    };
    return JasmineReporter;
})();
module.exports = JasmineReporter;
//# sourceMappingURL=JasmineReporter.js.map