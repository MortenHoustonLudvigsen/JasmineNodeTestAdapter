import util = require('util');
import Specs = require('../TestServer/Specs');
import TestContext = require('../TestServer/TestContext');
import TestReporter = require('../TestServer/TestReporter');
import Logger = require('../TestServer/Logger');
import Timer = require('./Timer');
import JasmineLogger = require('./JasmineLogger');

interface SuiteInfo {
    totalSpecsDefined?: number;
}

interface Result {
    root?: boolean;
    id?: string;
    isSuite?: boolean;
    suite?: SuiteResult;
    source?: any;
    fullName?: string;
    description?: string;
    status?: string;
    startTime?: number;
    endTime?: number;
}

interface SuiteResult extends Result {
}

interface SpecResult extends Result {
    failedExpectations?: any[];
}

function isValidStackFrame(entry: string): boolean {
    return (entry ? true : false) &&
        // discard entries related to jasmine:
        !/[\/\\]jasmine-core[\/\\]/.test(entry) &&
        // discard entries related to the Jasmine Node test adapter:
        !/[\/\\]JasmineTestServer[\/\\]/.test(entry);
}

function pruneStack(stack: string): string[] {
    return stack
        .split(/\r\n|\n/)
        .filter(frame => isValidStackFrame(frame));
}

function getFailure(failure: any): Specs.Failure {
    var expectation = <Specs.Failure>{
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
    } else if (failure.stacktrace) {
        var stack = pruneStack(failure.stacktrace).slice(messageLines.length);
        stack.unshift(messageLines[0] || '');
        expectation.stack = { stacktrace: stack.join('\n') };
    }

    return expectation;
}

function skipLines(str: string, count: number): string {
    return str.split(/\r\n|\n/).slice(count).join('\n');
}

function formatFailure(failure: Specs.Failure): string {
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

class JasmineReporter {
    constructor(public server: Specs.Server, public basePath: string) {
    }

    private logger = JasmineLogger('Jasmine Reporter');
    private testReporter: TestReporter;
    private context: Specs.Context;
    private currentSuite: SuiteResult;
    public isRunning = false;

    private getSuiteList(result: Result): string[] {
        if (result.root || result.suite.root) {
            return [];
        }

        var suites = this.getSuiteList(result.suite);
        suites.push(result.suite.description);
        return suites;
    }

    private originalConsoleFunctions = {
        log: console.log,
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error
    };

    private replaceConsole(): void {
        ['log', 'debug', 'info', 'warn', 'error'].forEach(item => {
            console[item] = () => this.testReporter.onOutput(this.context, util.format.apply(util, arguments));
        });
    }

    private restoreConsole(): void {
        ['log', 'debug', 'info', 'warn', 'error'].forEach(item => {
            console[item] = this.originalConsoleFunctions[item];
        });
    }

    jasmineStarted(suiteInfo: SuiteInfo) {
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
        this.testReporter = new TestReporter(this.server, this.basePath, this.logger, fileName => fileName);
        this.testReporter.onTestRunStart();
        this.testReporter.onContextStart(this.context);
        this.replaceConsole();
    }

    jasmineDone() {
        this.restoreConsole();
        this.testReporter.onContextDone(this.context);
        this.testReporter.onTestRunComplete();
        this.isRunning = false;
    }

    jasmineFailed(error: any): void {
        if (!this.isRunning) {
            this.jasmineStarted({ totalSpecsDefined: undefined });
        }
        this.testReporter.onError(this.context, error);
        this.jasmineDone();
    }

    suiteStarted(suite: SuiteResult) {
        if (!isTopLevelSuite(suite)) {
            suite.isSuite = true;
            suite.suite = this.currentSuite;
            suite.startTime = Timer.now();
            this.currentSuite = suite;
            this.testReporter.onSuiteStart(this.context);
        }
    }

    suiteDone(suite: SuiteResult) {
        if (!isTopLevelSuite(suite)) {
            suite.endTime = Timer.now();

            // In the case of xdescribe, only "suiteDone" is fired.
            // We need to skip that.
            if (this.currentSuite === suite) {
                this.currentSuite = suite.suite;
            }
            this.testReporter.onSuiteDone(this.context);
        }
    }

    specStarted(spec: SpecResult) {
        spec.suite = this.currentSuite;
        spec.startTime = Timer.now();

        this.testReporter.onSpecStart(this.context, {
            description: spec.description,
            id: spec.id
        });
    }

    specDone(spec: SpecResult) {
        spec.endTime = Timer.now();
        var failures = spec.failedExpectations ? spec.failedExpectations.map(exp => getFailure(exp)) : [];
        this.testReporter.onSpecDone(this.context, {
            description: spec.description,
            id: spec.id,
            log: failures.map(failure => formatFailure(failure)),
            skipped: spec.status === 'disabled' || spec.status === 'pending',
            success: spec.failedExpectations.length === 0,
            suite: this.getSuiteList(spec),
            time: spec.endTime - spec.startTime,
            startTime: spec.startTime,
            endTime: spec.endTime,
            source: spec.source,
            failures: failures
        });
    }
}

export = JasmineReporter;
