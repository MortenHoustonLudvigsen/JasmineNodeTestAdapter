import Specs = require('../TestServer/Specs');

interface WrappedFunction extends Function {
    __test_adapter_source_wrapped?: boolean;
}

export function wrapFunctions(jasmineEnv: any): void {
    ['describe', 'xdescribe', 'fdescribe', 'it', 'xit', 'fit'].forEach(functionName => {
        var oldFunction: WrappedFunction = jasmineEnv[functionName];

        if (typeof oldFunction !== 'function' || oldFunction.__test_adapter_source_wrapped) {
            return;
        }

        var wrapped: { [name: string]: WrappedFunction } = {};
        wrapped[functionName] = function (description: string, done: Function): void {
            var item = oldFunction.apply(this, Array.prototype.slice.call(arguments));
            try {
                // throw error to get a stack trace
                throw new Error();
            } catch (error) {
                // record the stack trace
                item.result.source = <Specs.StackInfo>{
                    // To find the stack frame that corresponds to the spec,
                    // skip the first 2 stack frames, then skip any stack frames
                    // with function names matching "^(jasmineInterface|Env)\."
                    skip: 2,
                    skipFunctions: "^(jasmineInterface|Env)\.",
                    stack: error.stack
                };
            }
            return item;
        };
        wrapped[functionName].__test_adapter_source_wrapped = true;
        jasmineEnv[functionName] = wrapped[functionName];
    });
}
 