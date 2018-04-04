import {stream, writeStream, Distinct, demux} from "../f10-stream/src";

import {suite, test, timeout} from "mocha-typescript";
import {default as assert, fail} from "assert";

const someValues = [] as number[];
const someValuesLength = 0x100;
for (let i = 0; i < someValuesLength; i++) someValues.push(i);

function delay<T>(fn: Promise<T> | T | (() => T | Promise<T>)) {
    return Promise.resolve().then(() => typeof fn === "function" ? fn() : fn);
}

@suite
export class IterableStreams {

    @test
    controlSync() {
        const actual = [] as number[];
        for (let value of someValues) actual.push(value * 10);
        assert.deepEqual(actual, someValues.map(v => v * 10));
    }

    @test
    controlSyncIterator() {
        const iterator = function* () {
            for (let value of someValues) yield value * 10;
        };
        const actual = [] as number[];
        for (let value of iterator()) actual.push(value);
        assert.deepEqual(actual, someValues.map(v => v * 10));
    }

    @test
    async controlAsync() {
        const actual = [] as number[];
        for await (let value of someValues) actual.push(value);
        assert.deepEqual(actual, someValues);
    }

    @test
    async controlAsyncIterator() {
        const iterator = async function* () {
            for await (let value of someValues) yield value;
        };
        const actual = [] as number[];
        for await (let value of iterator()) actual.push(value);
        assert.deepEqual(actual, someValues);
    }

    @test
    async simpleStream() {
        const expected = someValues.map(v => v * 10);
        const s1 = stream(async function* () {
            for (let value of someValues) yield value * 10;
        });
        const actual = [];
        for await (let value of s1) actual.push(value);
        assert.deepEqual(actual, expected);
    }

    @test(timeout(someValues.length * 0x10))
    async asyncSimpleStream() {
        const expected = someValues.map(v => v * 10);

        const s1 = stream(async function* () {
            for (let value of someValues) yield 10 * await delay(value);
        });
        const actual = [];
        for await (let value of s1) {
            actual.push(value);
        }
        assert.deepEqual(actual, expected);
    }

    @test
    async simpleArrayStream() {
        const expected: Array<number> = someValues.map(v => v * 10);
        const s1 = stream(expected);
        const actual = [];
        for await (let value of s1) actual.push(value);
        assert.deepEqual(actual, expected);
    }

    @test
    async simpleIteratorStream() {
        const s1 = stream(function* () {
            for (let value of someValues) yield value;
        });
        const actual = [];
        for await (let value of s1) actual.push(value);
        assert.deepEqual(actual, someValues);
    }

    @test
    async asyncIterableStream() {
        const s1 = stream(async function* () {
            for (let value of someValues) yield value;
        });
        const s2 = stream(s1);
        const actual = [];
        for await (let value of s2) actual.push(value);
        assert.deepEqual(actual, someValues);
    }
}

@suite
export class WriteStreams {

    @test
    async simpleAsyncStream() {
        const values = writeStream<number>();
        await Promise.all([delay(async () => {
            try {
                for (let value of someValues) await delay(async () => values.write(value));
                await delay(() => values.done());
            } catch (e) {
                fail(e);
            }
        }),
            delay(async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })
        ]);
    }

    @test
    async simpleAsyncStreamMultiDone() {
        const values = writeStream<number>();
        await Promise.all([delay(async () => {
            try {
                for (let value of someValues) await delay(() => values.write(value));
                await delay(async () => {
                    await values.done()
                    await values.done()
                    await values.done()
                });
            } catch (e) {
                fail(e);
            }
        }),
            delay(async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })
        ]);
    }

    // noinspection FunctionWithMultipleLoopsJS
    @test
    async simpleSyncStream() {
        const values = writeStream<number>(Distinct);
        for (let value of someValues) await values.write(value);
        await values.done();
        const actual = [];
        for await (let value of values) actual.push(value);
        assert.deepEqual(actual, someValues);
    }

    // noinspection FunctionWithMultipleLoopsJS
    @test
    async bufferSize1Sync() {
        const size = 1;
        const values = writeStream<number>({...Distinct, size});
        for (let value of someValues) await values.write(value);
        await values.done();
        const actual = [];
        for await (let value of values) actual.push(value);
        assert.deepEqual(actual, someValues.slice(-size));
    }

    // noinspection FunctionWithMultipleLoopsJS
    @test
    async bufferSize2Sync() {
        const size = 2;
        const values = writeStream<number>({...Distinct, size});
        for (let value of someValues) await values.write(value);
        await values.done();
        const actual = [];
        for await (let value of values) actual.push(value);
        assert.deepEqual(actual, someValues.slice(-size));
    }

    // noinspection FunctionWithMultipleLoopsJS
    @test()
    async bufferSize0Sync() {
        const values = writeStream<number>({...Distinct, size: 0});
        for (let value of someValues) await values.write(value);
        await values.done();
        for await (let value of values) fail(`value: ${value}`);
    }

    // noinspection FunctionWithMultipleLoopsJS
    @test
    async unboundedSyncStream() {
        const values = writeStream<number>({...Distinct});
        for (let value of someValues) await values.write(value);
        const actual = [];
        let received = 0;
        for await (let value of values) {
            received = received + 1;
            actual.push(value);
            if (received == someValues.length) {
                assert.deepEqual(actual, someValues);
                await values.done();
            }
            if (received > someValues.length) fail("spill");
        }
    }

    // noinspection FunctionWithMultipleLoopsJS
    @test
    async unboundedSize1SyncStream() {
        const size = 1;
        const values = writeStream<number>({...Distinct, size});
        for (let value of someValues) await values.write(value);
        const actual = [];
        let received = 0;
        for await (let value of values) {
            received = received + 1;
            actual.push(value);
            if (received == size) {
                assert.deepEqual(actual, someValues.slice(-size));
                await values.done();
            }
            if (received > someValues.length) {
                fail("spill");
            }
        }
    }

    // noinspection FunctionWithMultipleLoopsJS
    @test
    async unboundedSize2SyncStream() {
        const size = 2;
        const values = writeStream<number>({...Distinct, size, replay: size});
        for (let value of someValues) await values.write(value);
        const actual = [];
        let received = 0;
        for await (let value of values) {
            received = received + 1;
            actual.push(value);
            if (received == size) {
                assert.deepEqual(actual, someValues.slice(-size));
                await values.done();
            }
            if (received > someValues.length) {
                fail("spill");
            }
        }
    }

    // noinspection FunctionWithMultipleLoopsJS
    @test
    async unboundedSize3SyncStream() {
        const size = 3;
        const values = writeStream<number>({...Distinct, size, replay: size});
        for (let value of someValues) await values.write(value);
        const actual = [];
        let received = 0;
        for await (let value of values) {
            received = received + 1;
            actual.push(value);
            if (received == size) {
                assert.deepEqual(actual, someValues.slice(-size));
                await values.done();
            }
            if (received > someValues.length) {
                fail("spill");
            }
        }
    }

    // noinspection FunctionWithMultipleLoopsJS
    @test
    async unboundedSize0SyncStream() {
        const values = writeStream<number>({...Distinct});
        for (let value of someValues) await values.write(value);
        const actual = [];
        let received = 0;
        for await (let value of values) {
            received = received + 1;
            actual.push(value);
            if (received == someValues.length) {
                assert.deepEqual(actual, someValues);
                await values.done();
            }
            if (received > someValues.length) {
                fail("spill");
            }
        }
    }

    @test
    async simpleSyncStreamAsyncFirstReceive() {
        const values = writeStream<number>();
        await Promise.all([
            delay(async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            }),
            delay(async () => {
                for (let value of someValues) await values.write(value);
                await values.done();
            })
        ]);
    }

    @test
    async simpleAsyncStreamAsyncFirstReceive() {
        const values = writeStream<number>();
        await Promise.all([
            delay(async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            }),
            delay(async () => {
                for (let value of someValues) {
                    await values.write(value);
                    await delay(0);
                }
                await values.done();
            })
        ]);
    }

    @test
    async bufferSize0SyncAsyncFirstReceive() {
        const values = writeStream<number>({...Distinct, size: 0});
        await Promise.all([delay(async () => {
            const actual = [];
            for await (let value of values) actual.push(value);
            assert.deepEqual(actual, someValues);

        }), delay(async () => {
            for (let value of someValues) await values.write(value);
            await values.done();
        })]);
    }

    @test()
    async bufferSize0AsyncAsyncFirstReceive() {
        const values = writeStream<number>({...Distinct, size: 0});
        await Promise.all([delay(async () => {
            const actual = [];
            for await (let value of values) actual.push(value);
            assert.deepEqual(actual, someValues);

        }), delay(async () => {
            for (let value of someValues) {
                await values.write(value);
                await delay(0);
            }
            await values.done();
        })]);
    }

    @test
    async bufferSize1SyncAsyncFirstReceive() {
        const values = writeStream<number>({...Distinct, size: 1});
        await Promise.all([delay(async () => {
            const actual = [];
            for await (let value of values) actual.push(value);
            assert.deepEqual(actual, someValues);
        }), delay(async () => {
            for (let value of someValues) await values.write(value);
            await values.done();
        })]);
    }

    @test()
    async bufferSize1AsyncAsyncFirstReceive() {
        const values = writeStream<number>({...Distinct, size: 1});
        await Promise.all([delay(async () => {
            const actual = [];
            for await (let value of values) actual.push(value);
            assert.deepEqual(actual, someValues);

        }), delay(async () => {
            for (let value of someValues) {
                await values.write(value);
                await delay(0);
            }
            await values.done();
        })]);
    }

    @test
    async bufferSize2SyncAsyncFirstReceive() {
        const values = writeStream<number>({...Distinct, size: 2});
        await Promise.all([delay(async () => {
            const actual = [];
            for await (let value of values) actual.push(value);
            assert.deepEqual(actual, someValues);

        }), delay(async () => {
            for (let value of someValues) await values.write(value);
            await values.done();
        })]);
    }

    @test()
    async bufferSize2AsyncAsyncFirstReceive() {
        const values = writeStream<number>({...Distinct, size: 2});
        await Promise.all([delay(async () => {
            const actual = [];
            for await (let value of values) actual.push(value);
            assert.deepEqual(actual, someValues);

        }), delay(async () => {
            for (let value of someValues) {
                await values.write(value);
                await delay(0);
            }
            await values.done();
        })]);
    }

    @test
    async bufferSize3SyncAsyncFirstReceive() {
        const values = writeStream<number>({...Distinct, size: 3});
        await Promise.all([delay(async () => {
            const actual = [];
            for await (let value of values) actual.push(value);
            assert.deepEqual(actual, someValues);

        }), delay(async () => {
            for (let value of someValues) {
                await values.write(value);
            }
            await values.done();
        })]);
    }

    @test()
    async bufferSize3AsyncAsyncFirstReceive() {
        const values = writeStream<number>({...Distinct, size: 3});
        await Promise.all([delay(async () => {
            const actual = [];
            for await (let value of values) actual.push(value);
            assert.deepEqual(actual, someValues);

        }), delay(async () => {
            for (let value of someValues) {
                await values.write(value);
                await delay(0);
            }
            await values.done();
        })]);
    }

    // noinspection FunctionWithMultipleLoopsJS
    @test
    async simpleSyncStream1Repeat() {
        const replay = 1;
        const values = writeStream<number>({...Distinct, replay});
        for (let value of someValues) await values.write(value);
        await values.done();
        const actual = [];
        for await (let value of values) actual.push(value);
        assert.deepEqual(actual, someValues.slice(-replay));
    }

    // noinspection FunctionWithMultipleLoopsJS
    @test
    async simpleSyncStream2Repeat() {
        const replay = 2;
        const values = writeStream<number>({...Distinct, replay});
        for (let value of someValues) await values.write(value);
        await values.done();
        const actual = [];
        for await (let value of values) actual.push(value);
        assert.deepEqual(actual, someValues.slice(-replay));
    }

    // noinspection FunctionWithMultipleLoopsJS
    @test
    async simpleSyncStream1Size1Repeat() {
        const replay = 1;
        const values = writeStream<number>({...Distinct, replay, size: replay});
        for (let value of someValues) await values.write(value);
        await values.done();
        const actual = [];
        for await (let value of values) actual.push(value);
        assert.deepEqual(actual, someValues.slice(-replay));
    }
}

@suite
export class SharedWriteStreams {
    // noinspection FunctionWithMultipleLoopsJS
    @test
    async simpleSyncShare2() {
        const values = writeStream<number>();
        for (let value of someValues) await values.write(value);
        await values.done();
        const actual1 = [];
        for await (let value of values) actual1.push(value);
        const actual2 = [];
        for await (let value of values) actual2.push(value);
        assert.deepEqual(actual1, someValues);
        assert.deepEqual(actual2, someValues);
    }

    // noinspection FunctionWithMultipleLoopsJS
    @test
    async simpleSyncShare3() {
        const values = writeStream<number>();
        for (let value of someValues) await values.write(value);
        await values.done();
        const actual1 = [];
        for await (let value of values) actual1.push(value);
        const actual2 = [];
        for await (let value of values) actual2.push(value);
        const actual3 = [];
        for await (let value of values) actual3.push(value);
        assert.deepEqual(actual1, someValues);
        assert.deepEqual(actual2, someValues);
        assert.deepEqual(actual3, someValues);
    }

    @test
    async simpleAsyncShare2() {
        const values = writeStream<number>();
        for (let value of someValues) await values.write(value);
        await values.done();
        await Promise.all([
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })()]);
    }

    @test
    async simpleAsyncShare2Size2() {
        const size = 2;
        const values = writeStream<number>({size});
        for (let value of someValues) await values.write(value);
        await values.done();
        await Promise.all([
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues.slice(-size));
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues.slice(-size));
            })()]);
    }


    @test
    async simpleAsyncShare2Size1() {
        const size = 1;
        const values = writeStream<number>({size});
        for (let value of someValues) await values.write(value);
        await values.done();
        await Promise.all([
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues.slice(-size));
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues.slice(-size));
            })()]);
    }

    @test
    async simpleAsyncShare2Size0() {
        const values = writeStream<number>({size: 0});
        for (let value of someValues) await values.write(value);
        await values.done();
        await Promise.all([
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, []);
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, []);
            })()]);
    }

    @test
    async simpleAsyncShare3() {
        const values = writeStream<number>();
        for (let value of someValues) await values.write(value);
        await values.done();
        await Promise.all([
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })()]);
    }

    @test
    async simpleAsyncShare2AsyncWrite() {
        const values = writeStream<number>();
        await Promise.all([
            (async () => {
                for (let value of someValues) await values.write(value);
                await values.done();
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })()]);
    }

    @test
    async simpleAsyncShare2AsyncWriteTween1() {
        const values = writeStream<number>();
        await Promise.all([
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                for (let value of someValues) await values.write(value);
                await values.done();
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })()]);
    }

    @test
    async simpleAsyncShare3AsyncWrite() {
        const values = writeStream<number>();
        await Promise.all([
            (async () => {
                for (let value of someValues) await values.write(value);
                await values.done();
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })()]);
    }

    @test
    async simpleAsyncShare3AsyncWriteTween2() {
        const values = writeStream<number>();
        await Promise.all([
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                for (let value of someValues) await values.write(value);
                await values.done();
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })()]);
    }

    @test
    async simpleAsyncShare3AsyncWriteTween2Delay() {
        const values = writeStream<number>();
        await Promise.all([
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            delay(async () => {
                for (let value of someValues) await values.write(value);
                await values.done();
            }),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })()]);
    }

    @test
    async simpleAsyncShare3AsyncWriteTween2Size2() {
        const size = 2;
        const values = writeStream<number>({size});
        await Promise.all([
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                for (let value of someValues) await values.write(value);
                await values.done();
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })()]);
    }

    @test
    async simpleAsyncShare3MixedWriteSize2() {
        const size = 2;
        const values = writeStream<number>({size});
        await Promise.all([
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                for (let value of someValues) await values.write(value);
                await values.done();
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues.slice(-size));
            })()
        ]);
    }

    @test
    async distinctAsyncShare3MixedWriteSize2() {
        const size = 2;
        const values = writeStream<number>({...Distinct, size});
        await Promise.all([
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                for (let value of [0, 0, 0, ...someValues]) await values.write(value);
                await values.done();
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues.slice(-size));
            })()
        ]);
    }

    @test
    async distinctTailAsyncShare3MixedWriteSize2() {
        const size = 2;
        const values = writeStream<number>({...Distinct, size});
        await Promise.all([
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                for (let value of [...someValues, someValuesLength - 1, someValuesLength - 1]) await values.write(value);
                await values.done();
                const actual = [];
                for await (let value of values) actual.push(value);
                assert.deepEqual(actual, someValues.slice(-size));
            })()
        ]);
    }

    @test
    async distinctTailAsyncShare3MixedWriteSize2Repeat2() {
        const size = 2;
        const values = writeStream<number>({...Distinct, size, replay: size});
        await Promise.all([
            (async () => {
                const actual = [];
                for await (let value of values) {
                    actual.push(value);
                }
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                const actual = [];
                for await (let value of values) {
                    actual.push(value);
                }
                assert.deepEqual(actual, someValues);
            })(),
            (async () => {
                for (let value of [...someValues, someValuesLength - 1, someValuesLength - 1]) await values.write(value);
                await values.done();
                const actual = [];
                for await (let value of values) {
                    actual.push(value);
                }
                assert.deepEqual(actual, someValues.slice(-size));
            })()
        ]);
    }
}

@suite
export class SharedStreams {
    @test
    async simpleShared() {
        const loop = {
            async* main() {
                for await (let value of someValues) {
                    yield (value * 10);
                }
            }
        };
        const derived = stream(loop.main).share();
        const expected = someValues.map(x => x * 10);
        await Promise.all([
            (async () => {
                const actual = [];
                for await (let value of derived) {
                    actual.push(value);
                }
                assert.deepEqual(actual, expected);
            })(),
            (async () => {
                const actual = [];
                for await (let value of derived) {
                    actual.push(value);
                }
                assert.deepEqual(actual, expected);
            })(),
        ]);
    }
}

@suite
export class DemuxStreams {
    @test
    async simpleDemux() {
        const values = demux<number, number>(x => x % 2);
        for (let value of someValues) {
            await values.write(value);
        }
        await values.done();
        const actualEven = [];
        for await (let value of values.get(0)) {
            actualEven.push(value);
        }
        const actualOdd = [];
        for await (let value of values.get(1)) {
            actualOdd.push(value);
        }
        assert.deepEqual(actualEven, someValues.filter(x => x % 2 === 0));
        assert.deepEqual(actualOdd, someValues.filter(x => x % 2 === 1));
    }
}
