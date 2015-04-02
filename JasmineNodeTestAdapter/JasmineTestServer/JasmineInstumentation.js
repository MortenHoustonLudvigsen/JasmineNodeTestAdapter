function wrapFunctions(jasmineEnv) {
    ['describe', 'xdescribe', 'fdescribe', 'it', 'xit', 'fit'].forEach(function (functionName) {
        var oldFunction = jasmineEnv[functionName];
        if (typeof oldFunction !== 'function' || oldFunction.__test_adapter_source_wrapped) {
            return;
        }
        var wrapped = {};
        wrapped[functionName] = function (description, done) {
            var item = oldFunction.apply(this, Array.prototype.slice.call(arguments));
            try {
                throw new Error();
            }
            catch (error) {
                // record the stack trace
                item.result.source = {
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
exports.wrapFunctions = wrapFunctions;
//# sourceMappingURL=JasmineInstumentation.js.map