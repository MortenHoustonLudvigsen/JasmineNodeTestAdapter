var startTime = process.hrtime();
// A high resolution timer
function now() {
    var time = process.hrtime(startTime);
    return time[0] * 1e3 + time[1] / 1e6;
}
exports.now = now;
//# sourceMappingURL=Timer.js.map