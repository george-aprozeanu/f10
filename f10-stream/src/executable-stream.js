"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("./stream");
class ExecutableStream extends stream_1.Stream {
    [Symbol.asyncIterator]() {
        return this.main();
    }
}
exports.ExecutableStream = ExecutableStream;
