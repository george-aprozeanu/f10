"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("../f10-stream/stream");
const mocha_typescript_1 = require("mocha-typescript");
const assert_1 = __importStar(require("assert"));
const someValues = [];
const someValuesLength = 0x1000;
for (let i = 0; i < someValuesLength; i++)
    someValues.push(i);
function delay(fn) {
    return Promise.resolve().then(() => typeof fn === "function" ? fn() : fn);
}
let IterableStreams = class IterableStreams {
    controlSync() {
        const actual = [];
        for (let value of someValues)
            actual.push(value * 10);
        assert_1.default.deepEqual(actual, someValues.map(v => v * 10));
    }
    controlSyncIterator() {
        const iterator = function* () {
            for (let value of someValues)
                yield value * 10;
        };
        const actual = [];
        for (let value of iterator())
            actual.push(value);
        assert_1.default.deepEqual(actual, someValues.map(v => v * 10));
    }
    controlAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const actual = [];
            try {
                for (var someValues_1 = __asyncValues(someValues), someValues_1_1; someValues_1_1 = yield someValues_1.next(), !someValues_1_1.done;) {
                    let value = yield someValues_1_1.value;
                    actual.push(value);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (someValues_1_1 && !someValues_1_1.done && (_a = someValues_1.return)) yield _a.call(someValues_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            assert_1.default.deepEqual(actual, someValues);
            var e_1, _a;
        });
    }
    controlAsyncIterator() {
        return __awaiter(this, void 0, void 0, function* () {
            const iterator = function () {
                return __asyncGenerator(this, arguments, function* () {
                    try {
                        for (var someValues_2 = __asyncValues(someValues), someValues_2_1; someValues_2_1 = yield __await(someValues_2.next()), !someValues_2_1.done;) {
                            let value = yield __await(someValues_2_1.value);
                            yield value;
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (someValues_2_1 && !someValues_2_1.done && (_a = someValues_2.return)) yield __await(_a.call(someValues_2));
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    var e_2, _a;
                });
            };
            const actual = [];
            try {
                for (var _a = __asyncValues(iterator()), _b; _b = yield _a.next(), !_b.done;) {
                    let value = yield _b.value;
                    actual.push(value);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) yield _c.call(_a);
                }
                finally { if (e_3) throw e_3.error; }
            }
            assert_1.default.deepEqual(actual, someValues);
            var e_3, _c;
        });
    }
    simpleStream() {
        return __awaiter(this, void 0, void 0, function* () {
            const expected = someValues.map(v => v * 10);
            const s1 = stream_1.stream(function () {
                return __asyncGenerator(this, arguments, function* () {
                    for (let value of someValues)
                        yield value * 10;
                });
            });
            const actual = [];
            try {
                for (var s1_1 = __asyncValues(s1), s1_1_1; s1_1_1 = yield s1_1.next(), !s1_1_1.done;) {
                    let value = yield s1_1_1.value;
                    actual.push(value);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (s1_1_1 && !s1_1_1.done && (_a = s1_1.return)) yield _a.call(s1_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
            assert_1.default.deepEqual(actual, expected);
            var e_4, _a;
        });
    }
    asyncSimpleStream() {
        return __awaiter(this, void 0, void 0, function* () {
            const expected = someValues.map(v => v * 10);
            const s1 = stream_1.stream(function () {
                return __asyncGenerator(this, arguments, function* () {
                    for (let value of someValues)
                        yield 10 * (yield __await(delay(value)));
                });
            });
            const actual = [];
            try {
                for (var s1_2 = __asyncValues(s1), s1_2_1; s1_2_1 = yield s1_2.next(), !s1_2_1.done;) {
                    let value = yield s1_2_1.value;
                    actual.push(value);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (s1_2_1 && !s1_2_1.done && (_a = s1_2.return)) yield _a.call(s1_2);
                }
                finally { if (e_5) throw e_5.error; }
            }
            assert_1.default.deepEqual(actual, expected);
            var e_5, _a;
        });
    }
    simpleArrayStream() {
        return __awaiter(this, void 0, void 0, function* () {
            const expected = someValues.map(v => v * 10);
            const s1 = stream_1.stream(expected);
            const actual = [];
            try {
                for (var s1_3 = __asyncValues(s1), s1_3_1; s1_3_1 = yield s1_3.next(), !s1_3_1.done;) {
                    let value = yield s1_3_1.value;
                    actual.push(value);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (s1_3_1 && !s1_3_1.done && (_a = s1_3.return)) yield _a.call(s1_3);
                }
                finally { if (e_6) throw e_6.error; }
            }
            assert_1.default.deepEqual(actual, expected);
            var e_6, _a;
        });
    }
    simpleIteratorStream() {
        return __awaiter(this, void 0, void 0, function* () {
            const s1 = stream_1.stream(function* () {
                for (let value of someValues)
                    yield value;
            });
            const actual = [];
            try {
                for (var s1_4 = __asyncValues(s1), s1_4_1; s1_4_1 = yield s1_4.next(), !s1_4_1.done;) {
                    let value = yield s1_4_1.value;
                    actual.push(value);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (s1_4_1 && !s1_4_1.done && (_a = s1_4.return)) yield _a.call(s1_4);
                }
                finally { if (e_7) throw e_7.error; }
            }
            assert_1.default.deepEqual(actual, someValues);
            var e_7, _a;
        });
    }
    asyncIterableStream() {
        return __awaiter(this, void 0, void 0, function* () {
            const s1 = stream_1.stream(function () {
                return __asyncGenerator(this, arguments, function* () {
                    for (let value of someValues)
                        yield value;
                });
            });
            const s2 = stream_1.stream(s1);
            const actual = [];
            try {
                for (var s2_1 = __asyncValues(s2), s2_1_1; s2_1_1 = yield s2_1.next(), !s2_1_1.done;) {
                    let value = yield s2_1_1.value;
                    actual.push(value);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (s2_1_1 && !s2_1_1.done && (_a = s2_1.return)) yield _a.call(s2_1);
                }
                finally { if (e_8) throw e_8.error; }
            }
            assert_1.default.deepEqual(actual, someValues);
            var e_8, _a;
        });
    }
};
__decorate([
    mocha_typescript_1.test
], IterableStreams.prototype, "controlSync", null);
__decorate([
    mocha_typescript_1.test
], IterableStreams.prototype, "controlSyncIterator", null);
__decorate([
    mocha_typescript_1.test
], IterableStreams.prototype, "controlAsync", null);
__decorate([
    mocha_typescript_1.test
], IterableStreams.prototype, "controlAsyncIterator", null);
__decorate([
    mocha_typescript_1.test
], IterableStreams.prototype, "simpleStream", null);
__decorate([
    mocha_typescript_1.test(mocha_typescript_1.timeout(someValues.length * 0x10))
], IterableStreams.prototype, "asyncSimpleStream", null);
__decorate([
    mocha_typescript_1.test
], IterableStreams.prototype, "simpleArrayStream", null);
__decorate([
    mocha_typescript_1.test
], IterableStreams.prototype, "simpleIteratorStream", null);
__decorate([
    mocha_typescript_1.test
], IterableStreams.prototype, "asyncIterableStream", null);
IterableStreams = __decorate([
    mocha_typescript_1.suite
], IterableStreams);
exports.IterableStreams = IterableStreams;
let WriteStreams = class WriteStreams {
    simpleAsyncStream() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream();
            yield Promise.all([delay(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        for (let value of someValues)
                            yield delay(() => __awaiter(this, void 0, void 0, function* () { return values.write(value); }));
                        yield delay(() => values.done());
                    }
                    catch (e) {
                        assert_1.fail(e);
                    }
                })),
                delay(() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_1 = __asyncValues(values), values_1_1; values_1_1 = yield values_1.next(), !values_1_1.done;) {
                            let value = yield values_1_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_9_1) { e_9 = { error: e_9_1 }; }
                    finally {
                        try {
                            if (values_1_1 && !values_1_1.done && (_a = values_1.return)) yield _a.call(values_1);
                        }
                        finally { if (e_9) throw e_9.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_9, _a;
                }))
            ]);
        });
    }
    simpleAsyncStreamMultiDone() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream();
            yield Promise.all([delay(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        for (let value of someValues)
                            yield delay(() => values.write(value));
                        yield delay(() => __awaiter(this, void 0, void 0, function* () {
                            yield values.done();
                            yield values.done();
                            yield values.done();
                        }));
                    }
                    catch (e) {
                        assert_1.fail(e);
                    }
                })),
                delay(() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_2 = __asyncValues(values), values_2_1; values_2_1 = yield values_2.next(), !values_2_1.done;) {
                            let value = yield values_2_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_10_1) { e_10 = { error: e_10_1 }; }
                    finally {
                        try {
                            if (values_2_1 && !values_2_1.done && (_a = values_2.return)) yield _a.call(values_2);
                        }
                        finally { if (e_10) throw e_10.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_10, _a;
                }))
            ]);
        });
    }
    // noinspection FunctionWithMultipleLoopsJS
    simpleSyncStream() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, -1, -1);
            for (let value of someValues)
                yield values.write(value);
            yield values.done();
            const actual = [];
            try {
                for (var values_3 = __asyncValues(values), values_3_1; values_3_1 = yield values_3.next(), !values_3_1.done;) {
                    let value = yield values_3_1.value;
                    actual.push(value);
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (values_3_1 && !values_3_1.done && (_a = values_3.return)) yield _a.call(values_3);
                }
                finally { if (e_11) throw e_11.error; }
            }
            assert_1.default.deepEqual(actual, someValues);
            var e_11, _a;
        });
    }
    // noinspection FunctionWithMultipleLoopsJS
    bufferSize1Sync() {
        return __awaiter(this, void 0, void 0, function* () {
            const bufferSize = 1;
            const values = stream_1.writeStream(true, bufferSize);
            for (let value of someValues)
                yield values.write(value);
            yield values.done();
            const actual = [];
            try {
                for (var values_4 = __asyncValues(values), values_4_1; values_4_1 = yield values_4.next(), !values_4_1.done;) {
                    let value = yield values_4_1.value;
                    actual.push(value);
                }
            }
            catch (e_12_1) { e_12 = { error: e_12_1 }; }
            finally {
                try {
                    if (values_4_1 && !values_4_1.done && (_a = values_4.return)) yield _a.call(values_4);
                }
                finally { if (e_12) throw e_12.error; }
            }
            assert_1.default.deepEqual(actual, someValues.slice(-bufferSize));
            var e_12, _a;
        });
    }
    // noinspection FunctionWithMultipleLoopsJS
    bufferSize2Sync() {
        return __awaiter(this, void 0, void 0, function* () {
            const bufferSize = 2;
            const values = stream_1.writeStream(true, bufferSize, -1);
            for (let value of someValues)
                yield values.write(value);
            yield values.done();
            const actual = [];
            try {
                for (var values_5 = __asyncValues(values), values_5_1; values_5_1 = yield values_5.next(), !values_5_1.done;) {
                    let value = yield values_5_1.value;
                    actual.push(value);
                }
            }
            catch (e_13_1) { e_13 = { error: e_13_1 }; }
            finally {
                try {
                    if (values_5_1 && !values_5_1.done && (_a = values_5.return)) yield _a.call(values_5);
                }
                finally { if (e_13) throw e_13.error; }
            }
            assert_1.default.deepEqual(actual, someValues.slice(-bufferSize));
            var e_13, _a;
        });
    }
    // noinspection FunctionWithMultipleLoopsJS
    bufferSize0Sync() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, 0);
            for (let value of someValues)
                yield values.write(value);
            yield values.done();
            try {
                for (var values_6 = __asyncValues(values), values_6_1; values_6_1 = yield values_6.next(), !values_6_1.done;) {
                    let value = yield values_6_1.value;
                    assert_1.fail(`value: ${value}`);
                }
            }
            catch (e_14_1) { e_14 = { error: e_14_1 }; }
            finally {
                try {
                    if (values_6_1 && !values_6_1.done && (_a = values_6.return)) yield _a.call(values_6);
                }
                finally { if (e_14) throw e_14.error; }
            }
            var e_14, _a;
        });
    }
    // noinspection FunctionWithMultipleLoopsJS
    unboundedSyncStream() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, -1, -1);
            for (let value of someValues)
                yield values.write(value);
            const actual = [];
            let received = 0;
            try {
                for (var values_7 = __asyncValues(values), values_7_1; values_7_1 = yield values_7.next(), !values_7_1.done;) {
                    let value = yield values_7_1.value;
                    received = received + 1;
                    actual.push(value);
                    if (received == someValues.length) {
                        assert_1.default.deepEqual(actual, someValues);
                        yield values.done();
                    }
                    if (received > someValues.length)
                        assert_1.fail("spill");
                }
            }
            catch (e_15_1) { e_15 = { error: e_15_1 }; }
            finally {
                try {
                    if (values_7_1 && !values_7_1.done && (_a = values_7.return)) yield _a.call(values_7);
                }
                finally { if (e_15) throw e_15.error; }
            }
            var e_15, _a;
        });
    }
    // noinspection FunctionWithMultipleLoopsJS
    unboundedSize1SyncStream() {
        return __awaiter(this, void 0, void 0, function* () {
            const bound = 1;
            const values = stream_1.writeStream(true, bound);
            for (let value of someValues)
                yield values.write(value);
            const actual = [];
            let received = 0;
            try {
                for (var values_8 = __asyncValues(values), values_8_1; values_8_1 = yield values_8.next(), !values_8_1.done;) {
                    let value = yield values_8_1.value;
                    received = received + 1;
                    actual.push(value);
                    if (received == bound) {
                        assert_1.default.deepEqual(actual, someValues.slice(-bound));
                        yield values.done();
                    }
                    if (received > someValues.length) {
                        assert_1.fail("spill");
                    }
                }
            }
            catch (e_16_1) { e_16 = { error: e_16_1 }; }
            finally {
                try {
                    if (values_8_1 && !values_8_1.done && (_a = values_8.return)) yield _a.call(values_8);
                }
                finally { if (e_16) throw e_16.error; }
            }
            var e_16, _a;
        });
    }
    // noinspection FunctionWithMultipleLoopsJS
    unboundedSize2SyncStream() {
        return __awaiter(this, void 0, void 0, function* () {
            const bound = 2;
            const values = stream_1.writeStream(true, bound, bound);
            for (let value of someValues)
                yield values.write(value);
            const actual = [];
            let received = 0;
            try {
                for (var values_9 = __asyncValues(values), values_9_1; values_9_1 = yield values_9.next(), !values_9_1.done;) {
                    let value = yield values_9_1.value;
                    received = received + 1;
                    actual.push(value);
                    if (received == bound) {
                        assert_1.default.deepEqual(actual, someValues.slice(-bound));
                        yield values.done();
                    }
                    if (received > someValues.length) {
                        assert_1.fail("spill");
                    }
                }
            }
            catch (e_17_1) { e_17 = { error: e_17_1 }; }
            finally {
                try {
                    if (values_9_1 && !values_9_1.done && (_a = values_9.return)) yield _a.call(values_9);
                }
                finally { if (e_17) throw e_17.error; }
            }
            var e_17, _a;
        });
    }
    // noinspection FunctionWithMultipleLoopsJS
    unboundedSize3SyncStream() {
        return __awaiter(this, void 0, void 0, function* () {
            const bound = 3;
            const values = stream_1.writeStream(true, bound, bound);
            for (let value of someValues)
                yield values.write(value);
            const actual = [];
            let received = 0;
            try {
                for (var values_10 = __asyncValues(values), values_10_1; values_10_1 = yield values_10.next(), !values_10_1.done;) {
                    let value = yield values_10_1.value;
                    received = received + 1;
                    actual.push(value);
                    if (received == bound) {
                        assert_1.default.deepEqual(actual, someValues.slice(-bound));
                        yield values.done();
                    }
                    if (received > someValues.length) {
                        assert_1.fail("spill");
                    }
                }
            }
            catch (e_18_1) { e_18 = { error: e_18_1 }; }
            finally {
                try {
                    if (values_10_1 && !values_10_1.done && (_a = values_10.return)) yield _a.call(values_10);
                }
                finally { if (e_18) throw e_18.error; }
            }
            var e_18, _a;
        });
    }
    // noinspection FunctionWithMultipleLoopsJS
    unboundedSize0SyncStream() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, -1, -1);
            for (let value of someValues)
                yield values.write(value);
            const actual = [];
            let received = 0;
            try {
                for (var values_11 = __asyncValues(values), values_11_1; values_11_1 = yield values_11.next(), !values_11_1.done;) {
                    let value = yield values_11_1.value;
                    received = received + 1;
                    actual.push(value);
                    if (received == someValues.length) {
                        assert_1.default.deepEqual(actual, someValues);
                        yield values.done();
                    }
                    if (received > someValues.length) {
                        assert_1.fail("spill");
                    }
                }
            }
            catch (e_19_1) { e_19 = { error: e_19_1 }; }
            finally {
                try {
                    if (values_11_1 && !values_11_1.done && (_a = values_11.return)) yield _a.call(values_11);
                }
                finally { if (e_19) throw e_19.error; }
            }
            var e_19, _a;
        });
    }
    simpleSyncStreamAsyncFirstReceive() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream();
            yield Promise.all([
                delay(() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_12 = __asyncValues(values), values_12_1; values_12_1 = yield values_12.next(), !values_12_1.done;) {
                            let value = yield values_12_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_20_1) { e_20 = { error: e_20_1 }; }
                    finally {
                        try {
                            if (values_12_1 && !values_12_1.done && (_a = values_12.return)) yield _a.call(values_12);
                        }
                        finally { if (e_20) throw e_20.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_20, _a;
                })),
                delay(() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues)
                        yield values.write(value);
                    yield values.done();
                }))
            ]);
        });
    }
    simpleAsyncStreamAsyncFirstReceive() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream();
            yield Promise.all([
                delay(() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_13 = __asyncValues(values), values_13_1; values_13_1 = yield values_13.next(), !values_13_1.done;) {
                            let value = yield values_13_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_21_1) { e_21 = { error: e_21_1 }; }
                    finally {
                        try {
                            if (values_13_1 && !values_13_1.done && (_a = values_13.return)) yield _a.call(values_13);
                        }
                        finally { if (e_21) throw e_21.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_21, _a;
                })),
                delay(() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues) {
                        yield values.write(value);
                        yield delay(0);
                    }
                    yield values.done();
                }))
            ]);
        });
    }
    bufferSize0SyncAsyncFirstReceive() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, 0);
            yield Promise.all([delay(() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_14 = __asyncValues(values), values_14_1; values_14_1 = yield values_14.next(), !values_14_1.done;) {
                            let value = yield values_14_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_22_1) { e_22 = { error: e_22_1 }; }
                    finally {
                        try {
                            if (values_14_1 && !values_14_1.done && (_a = values_14.return)) yield _a.call(values_14);
                        }
                        finally { if (e_22) throw e_22.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_22, _a;
                })), delay(() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues)
                        yield values.write(value);
                    yield values.done();
                }))]);
        });
    }
    bufferSize0AsyncAsyncFirstReceive() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, 0);
            yield Promise.all([delay(() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_15 = __asyncValues(values), values_15_1; values_15_1 = yield values_15.next(), !values_15_1.done;) {
                            let value = yield values_15_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_23_1) { e_23 = { error: e_23_1 }; }
                    finally {
                        try {
                            if (values_15_1 && !values_15_1.done && (_a = values_15.return)) yield _a.call(values_15);
                        }
                        finally { if (e_23) throw e_23.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_23, _a;
                })), delay(() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues) {
                        yield values.write(value);
                        yield delay(0);
                    }
                    yield values.done();
                }))]);
        });
    }
    bufferSize1SyncAsyncFirstReceive() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, 1, -1);
            yield Promise.all([delay(() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_16 = __asyncValues(values), values_16_1; values_16_1 = yield values_16.next(), !values_16_1.done;) {
                            let value = yield values_16_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_24_1) { e_24 = { error: e_24_1 }; }
                    finally {
                        try {
                            if (values_16_1 && !values_16_1.done && (_a = values_16.return)) yield _a.call(values_16);
                        }
                        finally { if (e_24) throw e_24.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_24, _a;
                })), delay(() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues)
                        yield values.write(value);
                    yield values.done();
                }))]);
        });
    }
    bufferSize1AsyncAsyncFirstReceive() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, 1, -1);
            yield Promise.all([delay(() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_17 = __asyncValues(values), values_17_1; values_17_1 = yield values_17.next(), !values_17_1.done;) {
                            let value = yield values_17_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_25_1) { e_25 = { error: e_25_1 }; }
                    finally {
                        try {
                            if (values_17_1 && !values_17_1.done && (_a = values_17.return)) yield _a.call(values_17);
                        }
                        finally { if (e_25) throw e_25.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_25, _a;
                })), delay(() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues) {
                        yield values.write(value);
                        yield delay(0);
                    }
                    yield values.done();
                }))]);
        });
    }
    bufferSize2SyncAsyncFirstReceive() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, 2, -1);
            yield Promise.all([delay(() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_18 = __asyncValues(values), values_18_1; values_18_1 = yield values_18.next(), !values_18_1.done;) {
                            let value = yield values_18_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_26_1) { e_26 = { error: e_26_1 }; }
                    finally {
                        try {
                            if (values_18_1 && !values_18_1.done && (_a = values_18.return)) yield _a.call(values_18);
                        }
                        finally { if (e_26) throw e_26.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_26, _a;
                })), delay(() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues)
                        yield values.write(value);
                    yield values.done();
                }))]);
        });
    }
    bufferSize2AsyncAsyncFirstReceive() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, 2, -1);
            yield Promise.all([delay(() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_19 = __asyncValues(values), values_19_1; values_19_1 = yield values_19.next(), !values_19_1.done;) {
                            let value = yield values_19_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_27_1) { e_27 = { error: e_27_1 }; }
                    finally {
                        try {
                            if (values_19_1 && !values_19_1.done && (_a = values_19.return)) yield _a.call(values_19);
                        }
                        finally { if (e_27) throw e_27.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_27, _a;
                })), delay(() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues) {
                        yield values.write(value);
                        yield delay(0);
                    }
                    yield values.done();
                }))]);
        });
    }
    bufferSize3SyncAsyncFirstReceive() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, 3, -1);
            yield Promise.all([delay(() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_20 = __asyncValues(values), values_20_1; values_20_1 = yield values_20.next(), !values_20_1.done;) {
                            let value = yield values_20_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_28_1) { e_28 = { error: e_28_1 }; }
                    finally {
                        try {
                            if (values_20_1 && !values_20_1.done && (_a = values_20.return)) yield _a.call(values_20);
                        }
                        finally { if (e_28) throw e_28.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_28, _a;
                })), delay(() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues) {
                        yield values.write(value);
                    }
                    yield values.done();
                }))]);
        });
    }
    bufferSize3AsyncAsyncFirstReceive() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, 3, -1);
            yield Promise.all([delay(() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_21 = __asyncValues(values), values_21_1; values_21_1 = yield values_21.next(), !values_21_1.done;) {
                            let value = yield values_21_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_29_1) { e_29 = { error: e_29_1 }; }
                    finally {
                        try {
                            if (values_21_1 && !values_21_1.done && (_a = values_21.return)) yield _a.call(values_21);
                        }
                        finally { if (e_29) throw e_29.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_29, _a;
                })), delay(() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues) {
                        yield values.write(value);
                        yield delay(0);
                    }
                    yield values.done();
                }))]);
        });
    }
    // noinspection FunctionWithMultipleLoopsJS
    simpleSyncStream1Repeat() {
        return __awaiter(this, void 0, void 0, function* () {
            const replayBound = 1;
            const values = stream_1.writeStream(true, -1, replayBound);
            for (let value of someValues)
                yield values.write(value);
            yield values.done();
            const actual = [];
            try {
                for (var values_22 = __asyncValues(values), values_22_1; values_22_1 = yield values_22.next(), !values_22_1.done;) {
                    let value = yield values_22_1.value;
                    actual.push(value);
                }
            }
            catch (e_30_1) { e_30 = { error: e_30_1 }; }
            finally {
                try {
                    if (values_22_1 && !values_22_1.done && (_a = values_22.return)) yield _a.call(values_22);
                }
                finally { if (e_30) throw e_30.error; }
            }
            assert_1.default.deepEqual(actual, someValues.slice(-replayBound));
            var e_30, _a;
        });
    }
    // noinspection FunctionWithMultipleLoopsJS
    simpleSyncStream2Repeat() {
        return __awaiter(this, void 0, void 0, function* () {
            const replayBound = 2;
            const values = stream_1.writeStream(true, -1, replayBound);
            for (let value of someValues)
                yield values.write(value);
            yield values.done();
            const actual = [];
            try {
                for (var values_23 = __asyncValues(values), values_23_1; values_23_1 = yield values_23.next(), !values_23_1.done;) {
                    let value = yield values_23_1.value;
                    actual.push(value);
                }
            }
            catch (e_31_1) { e_31 = { error: e_31_1 }; }
            finally {
                try {
                    if (values_23_1 && !values_23_1.done && (_a = values_23.return)) yield _a.call(values_23);
                }
                finally { if (e_31) throw e_31.error; }
            }
            assert_1.default.deepEqual(actual, someValues.slice(-replayBound));
            var e_31, _a;
        });
    }
    // noinspection FunctionWithMultipleLoopsJS
    simpleSyncStream1Size1Repeat() {
        return __awaiter(this, void 0, void 0, function* () {
            const replayBound = 1;
            const values = stream_1.writeStream(true, replayBound, replayBound);
            for (let value of someValues)
                yield values.write(value);
            yield values.done();
            const actual = [];
            try {
                for (var values_24 = __asyncValues(values), values_24_1; values_24_1 = yield values_24.next(), !values_24_1.done;) {
                    let value = yield values_24_1.value;
                    actual.push(value);
                }
            }
            catch (e_32_1) { e_32 = { error: e_32_1 }; }
            finally {
                try {
                    if (values_24_1 && !values_24_1.done && (_a = values_24.return)) yield _a.call(values_24);
                }
                finally { if (e_32) throw e_32.error; }
            }
            assert_1.default.deepEqual(actual, someValues.slice(-replayBound));
            var e_32, _a;
        });
    }
};
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "simpleAsyncStream", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "simpleAsyncStreamMultiDone", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "simpleSyncStream", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "bufferSize1Sync", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "bufferSize2Sync", null);
__decorate([
    mocha_typescript_1.test()
], WriteStreams.prototype, "bufferSize0Sync", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "unboundedSyncStream", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "unboundedSize1SyncStream", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "unboundedSize2SyncStream", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "unboundedSize3SyncStream", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "unboundedSize0SyncStream", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "simpleSyncStreamAsyncFirstReceive", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "simpleAsyncStreamAsyncFirstReceive", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "bufferSize0SyncAsyncFirstReceive", null);
__decorate([
    mocha_typescript_1.test()
], WriteStreams.prototype, "bufferSize0AsyncAsyncFirstReceive", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "bufferSize1SyncAsyncFirstReceive", null);
__decorate([
    mocha_typescript_1.test()
], WriteStreams.prototype, "bufferSize1AsyncAsyncFirstReceive", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "bufferSize2SyncAsyncFirstReceive", null);
__decorate([
    mocha_typescript_1.test()
], WriteStreams.prototype, "bufferSize2AsyncAsyncFirstReceive", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "bufferSize3SyncAsyncFirstReceive", null);
__decorate([
    mocha_typescript_1.test()
], WriteStreams.prototype, "bufferSize3AsyncAsyncFirstReceive", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "simpleSyncStream1Repeat", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "simpleSyncStream2Repeat", null);
__decorate([
    mocha_typescript_1.test
], WriteStreams.prototype, "simpleSyncStream1Size1Repeat", null);
WriteStreams = __decorate([
    mocha_typescript_1.suite
], WriteStreams);
exports.WriteStreams = WriteStreams;
let SharedWriteStreams = class SharedWriteStreams {
    // noinspection FunctionWithMultipleLoopsJS
    simpleSyncShare2() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, -1, -1);
            for (let value of someValues)
                yield values.write(value);
            yield values.done();
            const actual1 = [];
            try {
                for (var values_25 = __asyncValues(values), values_25_1; values_25_1 = yield values_25.next(), !values_25_1.done;) {
                    let value = yield values_25_1.value;
                    actual1.push(value);
                }
            }
            catch (e_33_1) { e_33 = { error: e_33_1 }; }
            finally {
                try {
                    if (values_25_1 && !values_25_1.done && (_a = values_25.return)) yield _a.call(values_25);
                }
                finally { if (e_33) throw e_33.error; }
            }
            const actual2 = [];
            try {
                for (var values_26 = __asyncValues(values), values_26_1; values_26_1 = yield values_26.next(), !values_26_1.done;) {
                    let value = yield values_26_1.value;
                    actual2.push(value);
                }
            }
            catch (e_34_1) { e_34 = { error: e_34_1 }; }
            finally {
                try {
                    if (values_26_1 && !values_26_1.done && (_b = values_26.return)) yield _b.call(values_26);
                }
                finally { if (e_34) throw e_34.error; }
            }
            assert_1.default.deepEqual(actual1, someValues);
            assert_1.default.deepEqual(actual2, someValues);
            var e_33, _a, e_34, _b;
        });
    }
    // noinspection FunctionWithMultipleLoopsJS
    simpleSyncShare3() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, -1, -1);
            for (let value of someValues)
                yield values.write(value);
            yield values.done();
            const actual1 = [];
            try {
                for (var values_27 = __asyncValues(values), values_27_1; values_27_1 = yield values_27.next(), !values_27_1.done;) {
                    let value = yield values_27_1.value;
                    actual1.push(value);
                }
            }
            catch (e_35_1) { e_35 = { error: e_35_1 }; }
            finally {
                try {
                    if (values_27_1 && !values_27_1.done && (_a = values_27.return)) yield _a.call(values_27);
                }
                finally { if (e_35) throw e_35.error; }
            }
            const actual2 = [];
            try {
                for (var values_28 = __asyncValues(values), values_28_1; values_28_1 = yield values_28.next(), !values_28_1.done;) {
                    let value = yield values_28_1.value;
                    actual2.push(value);
                }
            }
            catch (e_36_1) { e_36 = { error: e_36_1 }; }
            finally {
                try {
                    if (values_28_1 && !values_28_1.done && (_b = values_28.return)) yield _b.call(values_28);
                }
                finally { if (e_36) throw e_36.error; }
            }
            const actual3 = [];
            try {
                for (var values_29 = __asyncValues(values), values_29_1; values_29_1 = yield values_29.next(), !values_29_1.done;) {
                    let value = yield values_29_1.value;
                    actual3.push(value);
                }
            }
            catch (e_37_1) { e_37 = { error: e_37_1 }; }
            finally {
                try {
                    if (values_29_1 && !values_29_1.done && (_c = values_29.return)) yield _c.call(values_29);
                }
                finally { if (e_37) throw e_37.error; }
            }
            assert_1.default.deepEqual(actual1, someValues);
            assert_1.default.deepEqual(actual2, someValues);
            assert_1.default.deepEqual(actual3, someValues);
            var e_35, _a, e_36, _b, e_37, _c;
        });
    }
    simpleAsyncShare2() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, -1, -1);
            for (let value of someValues)
                yield values.write(value);
            yield values.done();
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_30 = __asyncValues(values), values_30_1; values_30_1 = yield values_30.next(), !values_30_1.done;) {
                            let value = yield values_30_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_38_1) { e_38 = { error: e_38_1 }; }
                    finally {
                        try {
                            if (values_30_1 && !values_30_1.done && (_a = values_30.return)) yield _a.call(values_30);
                        }
                        finally { if (e_38) throw e_38.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_38, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_31 = __asyncValues(values), values_31_1; values_31_1 = yield values_31.next(), !values_31_1.done;) {
                            let value = yield values_31_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_39_1) { e_39 = { error: e_39_1 }; }
                    finally {
                        try {
                            if (values_31_1 && !values_31_1.done && (_b = values_31.return)) yield _b.call(values_31);
                        }
                        finally { if (e_39) throw e_39.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_39, _b;
                }))()
            ]);
        });
    }
    simpleAsyncShare2Size2() {
        return __awaiter(this, void 0, void 0, function* () {
            const bound = 2;
            const values = stream_1.writeStream(true, bound, -1);
            for (let value of someValues)
                yield values.write(value);
            yield values.done();
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_32 = __asyncValues(values), values_32_1; values_32_1 = yield values_32.next(), !values_32_1.done;) {
                            let value = yield values_32_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_40_1) { e_40 = { error: e_40_1 }; }
                    finally {
                        try {
                            if (values_32_1 && !values_32_1.done && (_a = values_32.return)) yield _a.call(values_32);
                        }
                        finally { if (e_40) throw e_40.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues.slice(-bound));
                    var e_40, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_33 = __asyncValues(values), values_33_1; values_33_1 = yield values_33.next(), !values_33_1.done;) {
                            let value = yield values_33_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_41_1) { e_41 = { error: e_41_1 }; }
                    finally {
                        try {
                            if (values_33_1 && !values_33_1.done && (_b = values_33.return)) yield _b.call(values_33);
                        }
                        finally { if (e_41) throw e_41.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues.slice(-bound));
                    var e_41, _b;
                }))()
            ]);
        });
    }
    simpleAsyncShare2Size1() {
        return __awaiter(this, void 0, void 0, function* () {
            const bound = 1;
            const values = stream_1.writeStream(true, bound, -1);
            for (let value of someValues)
                yield values.write(value);
            yield values.done();
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_34 = __asyncValues(values), values_34_1; values_34_1 = yield values_34.next(), !values_34_1.done;) {
                            let value = yield values_34_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_42_1) { e_42 = { error: e_42_1 }; }
                    finally {
                        try {
                            if (values_34_1 && !values_34_1.done && (_a = values_34.return)) yield _a.call(values_34);
                        }
                        finally { if (e_42) throw e_42.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues.slice(-bound));
                    var e_42, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_35 = __asyncValues(values), values_35_1; values_35_1 = yield values_35.next(), !values_35_1.done;) {
                            let value = yield values_35_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_43_1) { e_43 = { error: e_43_1 }; }
                    finally {
                        try {
                            if (values_35_1 && !values_35_1.done && (_b = values_35.return)) yield _b.call(values_35);
                        }
                        finally { if (e_43) throw e_43.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues.slice(-bound));
                    var e_43, _b;
                }))()
            ]);
        });
    }
    simpleAsyncShare2Size0() {
        return __awaiter(this, void 0, void 0, function* () {
            const bound = 0;
            const values = stream_1.writeStream(true, bound);
            for (let value of someValues)
                yield values.write(value);
            yield values.done();
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_36 = __asyncValues(values), values_36_1; values_36_1 = yield values_36.next(), !values_36_1.done;) {
                            let value = yield values_36_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_44_1) { e_44 = { error: e_44_1 }; }
                    finally {
                        try {
                            if (values_36_1 && !values_36_1.done && (_a = values_36.return)) yield _a.call(values_36);
                        }
                        finally { if (e_44) throw e_44.error; }
                    }
                    assert_1.default.deepEqual(actual, []);
                    var e_44, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_37 = __asyncValues(values), values_37_1; values_37_1 = yield values_37.next(), !values_37_1.done;) {
                            let value = yield values_37_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_45_1) { e_45 = { error: e_45_1 }; }
                    finally {
                        try {
                            if (values_37_1 && !values_37_1.done && (_b = values_37.return)) yield _b.call(values_37);
                        }
                        finally { if (e_45) throw e_45.error; }
                    }
                    assert_1.default.deepEqual(actual, []);
                    var e_45, _b;
                }))()
            ]);
        });
    }
    simpleAsyncShare3() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream(true, -1, -1);
            for (let value of someValues)
                yield values.write(value);
            yield values.done();
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_38 = __asyncValues(values), values_38_1; values_38_1 = yield values_38.next(), !values_38_1.done;) {
                            let value = yield values_38_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_46_1) { e_46 = { error: e_46_1 }; }
                    finally {
                        try {
                            if (values_38_1 && !values_38_1.done && (_a = values_38.return)) yield _a.call(values_38);
                        }
                        finally { if (e_46) throw e_46.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_46, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_39 = __asyncValues(values), values_39_1; values_39_1 = yield values_39.next(), !values_39_1.done;) {
                            let value = yield values_39_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_47_1) { e_47 = { error: e_47_1 }; }
                    finally {
                        try {
                            if (values_39_1 && !values_39_1.done && (_b = values_39.return)) yield _b.call(values_39);
                        }
                        finally { if (e_47) throw e_47.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_47, _b;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_40 = __asyncValues(values), values_40_1; values_40_1 = yield values_40.next(), !values_40_1.done;) {
                            let value = yield values_40_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_48_1) { e_48 = { error: e_48_1 }; }
                    finally {
                        try {
                            if (values_40_1 && !values_40_1.done && (_c = values_40.return)) yield _c.call(values_40);
                        }
                        finally { if (e_48) throw e_48.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_48, _c;
                }))()
            ]);
        });
    }
    simpleAsyncShare2AsyncWrite() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream();
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues)
                        yield values.write(value);
                    yield values.done();
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_41 = __asyncValues(values), values_41_1; values_41_1 = yield values_41.next(), !values_41_1.done;) {
                            let value = yield values_41_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_49_1) { e_49 = { error: e_49_1 }; }
                    finally {
                        try {
                            if (values_41_1 && !values_41_1.done && (_a = values_41.return)) yield _a.call(values_41);
                        }
                        finally { if (e_49) throw e_49.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_49, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_42 = __asyncValues(values), values_42_1; values_42_1 = yield values_42.next(), !values_42_1.done;) {
                            let value = yield values_42_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_50_1) { e_50 = { error: e_50_1 }; }
                    finally {
                        try {
                            if (values_42_1 && !values_42_1.done && (_b = values_42.return)) yield _b.call(values_42);
                        }
                        finally { if (e_50) throw e_50.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_50, _b;
                }))()
            ]);
        });
    }
    simpleAsyncShare2AsyncWriteTween1() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream();
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_43 = __asyncValues(values), values_43_1; values_43_1 = yield values_43.next(), !values_43_1.done;) {
                            let value = yield values_43_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_51_1) { e_51 = { error: e_51_1 }; }
                    finally {
                        try {
                            if (values_43_1 && !values_43_1.done && (_a = values_43.return)) yield _a.call(values_43);
                        }
                        finally { if (e_51) throw e_51.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_51, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues)
                        yield values.write(value);
                    yield values.done();
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_44 = __asyncValues(values), values_44_1; values_44_1 = yield values_44.next(), !values_44_1.done;) {
                            let value = yield values_44_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_52_1) { e_52 = { error: e_52_1 }; }
                    finally {
                        try {
                            if (values_44_1 && !values_44_1.done && (_b = values_44.return)) yield _b.call(values_44);
                        }
                        finally { if (e_52) throw e_52.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_52, _b;
                }))()
            ]);
        });
    }
    simpleAsyncShare3AsyncWrite() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream();
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues)
                        yield values.write(value);
                    yield values.done();
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_45 = __asyncValues(values), values_45_1; values_45_1 = yield values_45.next(), !values_45_1.done;) {
                            let value = yield values_45_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_53_1) { e_53 = { error: e_53_1 }; }
                    finally {
                        try {
                            if (values_45_1 && !values_45_1.done && (_a = values_45.return)) yield _a.call(values_45);
                        }
                        finally { if (e_53) throw e_53.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_53, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_46 = __asyncValues(values), values_46_1; values_46_1 = yield values_46.next(), !values_46_1.done;) {
                            let value = yield values_46_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_54_1) { e_54 = { error: e_54_1 }; }
                    finally {
                        try {
                            if (values_46_1 && !values_46_1.done && (_b = values_46.return)) yield _b.call(values_46);
                        }
                        finally { if (e_54) throw e_54.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_54, _b;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_47 = __asyncValues(values), values_47_1; values_47_1 = yield values_47.next(), !values_47_1.done;) {
                            let value = yield values_47_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_55_1) { e_55 = { error: e_55_1 }; }
                    finally {
                        try {
                            if (values_47_1 && !values_47_1.done && (_c = values_47.return)) yield _c.call(values_47);
                        }
                        finally { if (e_55) throw e_55.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_55, _c;
                }))()
            ]);
        });
    }
    simpleAsyncShare3AsyncWriteTween2() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream();
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_48 = __asyncValues(values), values_48_1; values_48_1 = yield values_48.next(), !values_48_1.done;) {
                            let value = yield values_48_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_56_1) { e_56 = { error: e_56_1 }; }
                    finally {
                        try {
                            if (values_48_1 && !values_48_1.done && (_a = values_48.return)) yield _a.call(values_48);
                        }
                        finally { if (e_56) throw e_56.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_56, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_49 = __asyncValues(values), values_49_1; values_49_1 = yield values_49.next(), !values_49_1.done;) {
                            let value = yield values_49_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_57_1) { e_57 = { error: e_57_1 }; }
                    finally {
                        try {
                            if (values_49_1 && !values_49_1.done && (_b = values_49.return)) yield _b.call(values_49);
                        }
                        finally { if (e_57) throw e_57.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_57, _b;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues)
                        yield values.write(value);
                    yield values.done();
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_50 = __asyncValues(values), values_50_1; values_50_1 = yield values_50.next(), !values_50_1.done;) {
                            let value = yield values_50_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_58_1) { e_58 = { error: e_58_1 }; }
                    finally {
                        try {
                            if (values_50_1 && !values_50_1.done && (_c = values_50.return)) yield _c.call(values_50);
                        }
                        finally { if (e_58) throw e_58.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_58, _c;
                }))()
            ]);
        });
    }
    simpleAsyncShare3AsyncWriteTween2Delay() {
        return __awaiter(this, void 0, void 0, function* () {
            const values = stream_1.writeStream();
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_51 = __asyncValues(values), values_51_1; values_51_1 = yield values_51.next(), !values_51_1.done;) {
                            let value = yield values_51_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_59_1) { e_59 = { error: e_59_1 }; }
                    finally {
                        try {
                            if (values_51_1 && !values_51_1.done && (_a = values_51.return)) yield _a.call(values_51);
                        }
                        finally { if (e_59) throw e_59.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_59, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_52 = __asyncValues(values), values_52_1; values_52_1 = yield values_52.next(), !values_52_1.done;) {
                            let value = yield values_52_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_60_1) { e_60 = { error: e_60_1 }; }
                    finally {
                        try {
                            if (values_52_1 && !values_52_1.done && (_b = values_52.return)) yield _b.call(values_52);
                        }
                        finally { if (e_60) throw e_60.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_60, _b;
                }))(),
                delay(() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues)
                        yield values.write(value);
                    yield values.done();
                })),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_53 = __asyncValues(values), values_53_1; values_53_1 = yield values_53.next(), !values_53_1.done;) {
                            let value = yield values_53_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_61_1) { e_61 = { error: e_61_1 }; }
                    finally {
                        try {
                            if (values_53_1 && !values_53_1.done && (_c = values_53.return)) yield _c.call(values_53);
                        }
                        finally { if (e_61) throw e_61.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_61, _c;
                }))()
            ]);
        });
    }
    simpleAsyncShare3AsyncWriteTween2Size2() {
        return __awaiter(this, void 0, void 0, function* () {
            const bound = 2;
            const values = stream_1.writeStream(true, 2, -1);
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_54 = __asyncValues(values), values_54_1; values_54_1 = yield values_54.next(), !values_54_1.done;) {
                            let value = yield values_54_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_62_1) { e_62 = { error: e_62_1 }; }
                    finally {
                        try {
                            if (values_54_1 && !values_54_1.done && (_a = values_54.return)) yield _a.call(values_54);
                        }
                        finally { if (e_62) throw e_62.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_62, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_55 = __asyncValues(values), values_55_1; values_55_1 = yield values_55.next(), !values_55_1.done;) {
                            let value = yield values_55_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_63_1) { e_63 = { error: e_63_1 }; }
                    finally {
                        try {
                            if (values_55_1 && !values_55_1.done && (_b = values_55.return)) yield _b.call(values_55);
                        }
                        finally { if (e_63) throw e_63.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_63, _b;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues)
                        yield values.write(value);
                    yield values.done();
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_56 = __asyncValues(values), values_56_1; values_56_1 = yield values_56.next(), !values_56_1.done;) {
                            let value = yield values_56_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_64_1) { e_64 = { error: e_64_1 }; }
                    finally {
                        try {
                            if (values_56_1 && !values_56_1.done && (_c = values_56.return)) yield _c.call(values_56);
                        }
                        finally { if (e_64) throw e_64.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_64, _c;
                }))()
            ]);
        });
    }
    simpleAsyncShare3MixedWriteSize2() {
        return __awaiter(this, void 0, void 0, function* () {
            const bound = 2;
            const values = stream_1.writeStream(true, 2, -1);
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_57 = __asyncValues(values), values_57_1; values_57_1 = yield values_57.next(), !values_57_1.done;) {
                            let value = yield values_57_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_65_1) { e_65 = { error: e_65_1 }; }
                    finally {
                        try {
                            if (values_57_1 && !values_57_1.done && (_a = values_57.return)) yield _a.call(values_57);
                        }
                        finally { if (e_65) throw e_65.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_65, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_58 = __asyncValues(values), values_58_1; values_58_1 = yield values_58.next(), !values_58_1.done;) {
                            let value = yield values_58_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_66_1) { e_66 = { error: e_66_1 }; }
                    finally {
                        try {
                            if (values_58_1 && !values_58_1.done && (_b = values_58.return)) yield _b.call(values_58);
                        }
                        finally { if (e_66) throw e_66.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_66, _b;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of someValues)
                        yield values.write(value);
                    yield values.done();
                    const actual = [];
                    try {
                        for (var values_59 = __asyncValues(values), values_59_1; values_59_1 = yield values_59.next(), !values_59_1.done;) {
                            let value = yield values_59_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_67_1) { e_67 = { error: e_67_1 }; }
                    finally {
                        try {
                            if (values_59_1 && !values_59_1.done && (_c = values_59.return)) yield _c.call(values_59);
                        }
                        finally { if (e_67) throw e_67.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues.slice(-bound));
                    var e_67, _c;
                }))()
            ]);
        });
    }
    distinctAsyncShare3MixedWriteSize2() {
        return __awaiter(this, void 0, void 0, function* () {
            const bound = 2;
            const values = stream_1.writeStream(true, 2, -1);
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_60 = __asyncValues(values), values_60_1; values_60_1 = yield values_60.next(), !values_60_1.done;) {
                            let value = yield values_60_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_68_1) { e_68 = { error: e_68_1 }; }
                    finally {
                        try {
                            if (values_60_1 && !values_60_1.done && (_a = values_60.return)) yield _a.call(values_60);
                        }
                        finally { if (e_68) throw e_68.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_68, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_61 = __asyncValues(values), values_61_1; values_61_1 = yield values_61.next(), !values_61_1.done;) {
                            let value = yield values_61_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_69_1) { e_69 = { error: e_69_1 }; }
                    finally {
                        try {
                            if (values_61_1 && !values_61_1.done && (_b = values_61.return)) yield _b.call(values_61);
                        }
                        finally { if (e_69) throw e_69.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_69, _b;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of [0, 0, 0, ...someValues])
                        yield values.write(value);
                    yield values.done();
                    const actual = [];
                    try {
                        for (var values_62 = __asyncValues(values), values_62_1; values_62_1 = yield values_62.next(), !values_62_1.done;) {
                            let value = yield values_62_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_70_1) { e_70 = { error: e_70_1 }; }
                    finally {
                        try {
                            if (values_62_1 && !values_62_1.done && (_c = values_62.return)) yield _c.call(values_62);
                        }
                        finally { if (e_70) throw e_70.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues.slice(-bound));
                    var e_70, _c;
                }))()
            ]);
        });
    }
    distinctTailAsyncShare3MixedWriteSize2() {
        return __awaiter(this, void 0, void 0, function* () {
            const bound = 2;
            const values = stream_1.writeStream(true, 2, -1);
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_63 = __asyncValues(values), values_63_1; values_63_1 = yield values_63.next(), !values_63_1.done;) {
                            let value = yield values_63_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_71_1) { e_71 = { error: e_71_1 }; }
                    finally {
                        try {
                            if (values_63_1 && !values_63_1.done && (_a = values_63.return)) yield _a.call(values_63);
                        }
                        finally { if (e_71) throw e_71.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_71, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_64 = __asyncValues(values), values_64_1; values_64_1 = yield values_64.next(), !values_64_1.done;) {
                            let value = yield values_64_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_72_1) { e_72 = { error: e_72_1 }; }
                    finally {
                        try {
                            if (values_64_1 && !values_64_1.done && (_b = values_64.return)) yield _b.call(values_64);
                        }
                        finally { if (e_72) throw e_72.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_72, _b;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of [...someValues, someValuesLength - 1, someValuesLength - 1])
                        yield values.write(value);
                    yield values.done();
                    const actual = [];
                    try {
                        for (var values_65 = __asyncValues(values), values_65_1; values_65_1 = yield values_65.next(), !values_65_1.done;) {
                            let value = yield values_65_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_73_1) { e_73 = { error: e_73_1 }; }
                    finally {
                        try {
                            if (values_65_1 && !values_65_1.done && (_c = values_65.return)) yield _c.call(values_65);
                        }
                        finally { if (e_73) throw e_73.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues.slice(-bound));
                    var e_73, _c;
                }))()
            ]);
        });
    }
    distinctTailAsyncShare3MixedWriteSize2Repeat2() {
        return __awaiter(this, void 0, void 0, function* () {
            const bound = 2;
            const values = stream_1.writeStream(true, bound, bound);
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_66 = __asyncValues(values), values_66_1; values_66_1 = yield values_66.next(), !values_66_1.done;) {
                            let value = yield values_66_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_74_1) { e_74 = { error: e_74_1 }; }
                    finally {
                        try {
                            if (values_66_1 && !values_66_1.done && (_a = values_66.return)) yield _a.call(values_66);
                        }
                        finally { if (e_74) throw e_74.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_74, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var values_67 = __asyncValues(values), values_67_1; values_67_1 = yield values_67.next(), !values_67_1.done;) {
                            let value = yield values_67_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_75_1) { e_75 = { error: e_75_1 }; }
                    finally {
                        try {
                            if (values_67_1 && !values_67_1.done && (_b = values_67.return)) yield _b.call(values_67);
                        }
                        finally { if (e_75) throw e_75.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues);
                    var e_75, _b;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    for (let value of [...someValues, someValuesLength - 1, someValuesLength - 1])
                        yield values.write(value);
                    yield values.done();
                    const actual = [];
                    try {
                        for (var values_68 = __asyncValues(values), values_68_1; values_68_1 = yield values_68.next(), !values_68_1.done;) {
                            let value = yield values_68_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_76_1) { e_76 = { error: e_76_1 }; }
                    finally {
                        try {
                            if (values_68_1 && !values_68_1.done && (_c = values_68.return)) yield _c.call(values_68);
                        }
                        finally { if (e_76) throw e_76.error; }
                    }
                    assert_1.default.deepEqual(actual, someValues.slice(-bound));
                    var e_76, _c;
                }))()
            ]);
        });
    }
};
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "simpleSyncShare2", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "simpleSyncShare3", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "simpleAsyncShare2", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "simpleAsyncShare2Size2", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "simpleAsyncShare2Size1", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "simpleAsyncShare2Size0", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "simpleAsyncShare3", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "simpleAsyncShare2AsyncWrite", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "simpleAsyncShare2AsyncWriteTween1", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "simpleAsyncShare3AsyncWrite", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "simpleAsyncShare3AsyncWriteTween2", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "simpleAsyncShare3AsyncWriteTween2Delay", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "simpleAsyncShare3AsyncWriteTween2Size2", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "simpleAsyncShare3MixedWriteSize2", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "distinctAsyncShare3MixedWriteSize2", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "distinctTailAsyncShare3MixedWriteSize2", null);
__decorate([
    mocha_typescript_1.test
], SharedWriteStreams.prototype, "distinctTailAsyncShare3MixedWriteSize2Repeat2", null);
SharedWriteStreams = __decorate([
    mocha_typescript_1.suite
], SharedWriteStreams);
exports.SharedWriteStreams = SharedWriteStreams;
let SharedStreams = class SharedStreams {
    simpleShared() {
        return __awaiter(this, void 0, void 0, function* () {
            const loop = {
                main() {
                    return __asyncGenerator(this, arguments, function* main_1() {
                        try {
                            for (var someValues_3 = __asyncValues(someValues), someValues_3_1; someValues_3_1 = yield __await(someValues_3.next()), !someValues_3_1.done;) {
                                let value = yield __await(someValues_3_1.value);
                                yield (value * 10);
                            }
                        }
                        catch (e_77_1) { e_77 = { error: e_77_1 }; }
                        finally {
                            try {
                                if (someValues_3_1 && !someValues_3_1.done && (_a = someValues_3.return)) yield __await(_a.call(someValues_3));
                            }
                            finally { if (e_77) throw e_77.error; }
                        }
                        var e_77, _a;
                    });
                }
            };
            const derived = stream_1.stream(loop.main).share();
            const expected = someValues.map(x => x * 10);
            yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var derived_1 = __asyncValues(derived), derived_1_1; derived_1_1 = yield derived_1.next(), !derived_1_1.done;) {
                            let value = yield derived_1_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_78_1) { e_78 = { error: e_78_1 }; }
                    finally {
                        try {
                            if (derived_1_1 && !derived_1_1.done && (_a = derived_1.return)) yield _a.call(derived_1);
                        }
                        finally { if (e_78) throw e_78.error; }
                    }
                    assert_1.default.deepEqual(actual, expected);
                    var e_78, _a;
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    const actual = [];
                    try {
                        for (var derived_2 = __asyncValues(derived), derived_2_1; derived_2_1 = yield derived_2.next(), !derived_2_1.done;) {
                            let value = yield derived_2_1.value;
                            actual.push(value);
                        }
                    }
                    catch (e_79_1) { e_79 = { error: e_79_1 }; }
                    finally {
                        try {
                            if (derived_2_1 && !derived_2_1.done && (_b = derived_2.return)) yield _b.call(derived_2);
                        }
                        finally { if (e_79) throw e_79.error; }
                    }
                    assert_1.default.deepEqual(actual, expected);
                    var e_79, _b;
                }))(),
            ]);
        });
    }
};
__decorate([
    mocha_typescript_1.test
], SharedStreams.prototype, "simpleShared", null);
SharedStreams = __decorate([
    mocha_typescript_1.suite
], SharedStreams);
exports.SharedStreams = SharedStreams;
