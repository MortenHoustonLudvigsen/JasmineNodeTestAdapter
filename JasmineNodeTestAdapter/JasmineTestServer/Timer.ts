var startTime = process.hrtime();

// A high resolution timer
export function now(): number {
    var time = process.hrtime(startTime);
    return time[0] * 1e3 + time[1] / 1e6;
}
 