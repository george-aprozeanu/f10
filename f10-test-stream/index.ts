import {Distinct, merge, rollup, stream, valueStream, writeStream} from "../f10-stream/src";

import {suite, test, timeout} from "mocha-typescript";
import {default as assert, fail} from "assert";

const someValues = [] as number[];
const someValuesLength = 0x10;
for (let i = 0; i < someValuesLength; i++) someValues.push(i);

function delay<T>(fn: Promise<T> | T | (() => T | Promise<T>)) {
	return Promise.resolve().then(() => typeof fn === "function" ? fn() : fn);
}

function wait(ms: number) {
	return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

import {rangeTo, rangeUntil, mapIterable} from '../f10-stream';

@suite
export class Libs {
	@test
	rangeTo() {
		assert.deepEqual([0, 1, 2], [...rangeTo(0, 3)]);
		assert.deepEqual([1, 2], [...rangeTo(1, 3)]);
		assert.deepEqual([1], [...rangeTo(1, 2)]);
		assert.deepEqual([], [...rangeTo(1, 1)]);
	}

	@test
	rangeUntil() {
		assert.deepEqual([0, 1, 2], [...rangeUntil(0, 2)]);
		assert.deepEqual([1, 2], [...rangeUntil(1, 2)]);
		assert.deepEqual([1], [...rangeUntil(1, 1)]);
		assert.deepEqual([], [...rangeUntil(1, 0)]);
	}
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

	@test
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
	async asyncSimpleStreamSyncWrite() {
		const expected = someValues.map(v => v * 10);

		const s1 = stream(async function* () {
			for (let value of someValues) yield 10 * value;
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
					values.done();
					values.done();
					values.done();
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
		for (let value of someValues) values.write(value);
		await values.done();
		const actual = [];
		for await (let value of values) actual.push(value);
		assert.deepEqual(actual, someValues);
	}

	// noinspection FunctionWithMultipleLoopsJS
	@test
	async unboundedSyncStream() {
		const values = writeStream<number>({...Distinct});
		for (let value of someValues) values.write(value);
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
				for (let value of someValues) values.write(value);
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
					values.write(value);
					await delay(0);
				}
				await values.done();
			})
		]);
	}

	// noinspection FunctionWithMultipleLoopsJS
	@test
	async simpleSyncStream1Repeat() {
		const replay = 1;
		const values = writeStream<number>({...Distinct, replay});
		for (let value of someValues) values.write(value);
		await values.done();
		const actual = [];
		for await (let value of values) actual.push(value);
		assert.deepEqual(actual, someValues.slice(-replay));
	}

	@test
	async simpleSyncStream1Repeat2() {
		const replay = 1;
		const values = writeStream<number>({...Distinct, replay});
		for (let value of someValues) values.write(value);
		await values.done();
		let actual = [];
		for await (let value of values) actual.push(value);
		assert.deepEqual(actual, someValues.slice(-replay));
		actual = [];
		for await (let value of values) actual.push(value);
		assert.deepEqual(actual, someValues.slice(-replay));
		actual = [];
		for await (let value of values) actual.push(value);
		assert.deepEqual(actual, someValues.slice(-replay));
	}


	@test
	async simpleSyncStream1Repeat2value() {
		const replay = 1;
		const values = valueStream<number>();
		for (let value of someValues) values.write(value);
		await values.done();
		let actual = [];
		for await (let value of values) actual.push(value);
		assert.deepEqual(actual, someValues.slice(-replay));
		actual = [];
		for await (let value of values) actual.push(value);
		assert.deepEqual(actual, someValues.slice(-replay));
		actual = [];
		for await (let value of values) actual.push(value);
		assert.deepEqual(actual, someValues.slice(-replay));
	}

	@test
	async simpleAsyncStream1Repeat2value() {
		const replay = 1;
		const values = valueStream<number>();
		for (let value of someValues) values.write(value);
		await delay(async () => {
			let actual = [];
			for await (let value of values) {
				values.done();
			}
			// assert.deepEqual(actual, someValues.slice(-replay));
		});

	}

	// noinspection FunctionWithMultipleLoopsJS
	@test
	async simpleSyncStream2Repeat() {
		const replay = 2;
		const values = writeStream<number>({...Distinct, replay});
		for (let value of someValues) values.write(value);
		await values.done();
		const actual = [];
		for await (let value of values) actual.push(value);
		assert.deepEqual(actual, someValues.slice(-replay));
	}

	@test(timeout(0x10 * 1000))
	async simpleAsyncStreamTTL100ms() {
		const ttl = 0;
		const values = writeStream<number>({ttl});
		const expected = someValues.slice(0, 0x10);
		await Promise.all([delay(async () => {
			try {
				for (let value of expected) {
					await wait(ttl);
					await delay(async () => values.write(value));
				}
				await delay(() => values.done());
			} catch (e) {
				fail(e);
			}
		}),
			delay(async () => {
				const actual = [];
				for await (let value of values) {
					actual.push(value);
				}
				assert.deepEqual(actual, expected);
			})
		]);
	}

	@test
	async testReread() {
		const values = valueStream<number>();
		for (let value of someValues) {
			values.write(value);
		}
		await Promise.all([
			(async () => {
				let actualValues = [];
				for await (let value of values) {
					actualValues.push(value);
				}
				assert.deepEqual(actualValues, [someValues[someValues.length - 1]]);
			})(),
			(async () => {
				let actualValues = [];
				for await (let value of values) {
					actualValues.push(value);
				}
				assert.deepEqual(actualValues, [someValues[someValues.length - 1]]);
			})(),
			(async () => {
				await new Promise((resolve, reject) => setTimeout(() => {
					values.done();
					resolve();
				}, 100));
			})()
		]);
	}

	@test
	async testRereadTTL() {
		const ttl = 100;
		const replay = 1;
		const values = valueStream<number>({ttl, replay});
		for (let value of someValues) {
			await delay(() => undefined);
			values.write(value);
		}
		await Promise.all([
			(async () => {
				const expectedValues = someValues.slice(-replay);
				for (let attempt of [1, 2, 3]) {
					let actualValues = [];
					for await (let value of values) {
						actualValues.push(value);
					}
					assert.deepEqual(actualValues, expectedValues, `attempt ${attempt}: 
                        actual: ${actualValues}
                      expected: ${expectedValues}`);
				}
			})(),
			(async () => {
				await new Promise((resolve, reject) => setTimeout(() => {
					values.done();
					resolve();
				}, ttl * 2));
			})()
		]);
	}

	@test
	async testRereadDone() {
		const values = valueStream<number>();
		for (let value of someValues) {
			values.write(value);
		}
		values.done();
		await delay(() => undefined);
		await Promise.all([
			(async () => {
				let actualValues = [];
				for await (let value of values) {
					actualValues.push(value);
				}
				assert.deepEqual(actualValues, [someValues[someValues.length - 1]]);
			})(),
			(async () => {
				let actualValues = [];
				for await (let value of values) {
					actualValues.push(value);
				}
				assert.deepEqual(actualValues, [someValues[someValues.length - 1]]);
			})()
		]);
	}
}

@suite
export class SharedWriteStreams {
	// noinspection FunctionWithMultipleLoopsJS
	@test
	async simpleSyncShare2() {
		const values = writeStream<number>();
		for (let value of someValues) values.write(value);
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
		for (let value of someValues) values.write(value);
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
		for (let value of someValues) values.write(value);
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
	async simpleAsyncShare3() {
		const values = writeStream<number>();
		for (let value of someValues) values.write(value);
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
				for (let value of someValues) values.write(value);
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
				for (let value of someValues) values.write(value);
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
				for (let value of someValues) values.write(value);
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
				for (let value of someValues) values.write(value);
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
				for (let value of someValues) values.write(value);
				await values.done();
			}),
			(async () => {
				const actual = [];
				for await (let value of values) actual.push(value);
				assert.deepEqual(actual, someValues);
			})()]);
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
export class MergedStreams {
	@test
	async simpleMergeSync() {
		const values1 = stream<number>(someValues);
		const values2 = stream<number>(function* () {
			for (let value of someValues) yield value * 10
		});
		const expected = [];
		for (let i = 0; i < someValuesLength; i++) {
			expected.push(someValues[i], someValues[i] * 10);
		}
		const merged = merge([values1, values2]);
		const actual = [];
		for await (let value of merged) {
			actual.push(value);
		}
		assert.deepEqual(actual, expected);
	}

	@test
	async simpleMergeAsync() {
		const values1 = stream(async function* () {
			for (const value of someValues) yield await delay(() => value);
		});
		const values2 = stream(async function* () {
			for (const value of someValues) yield await delay(() => value * 10);
		});
		const expected = [];
		for (let i = 0; i < someValuesLength; i++) {
			expected.push(someValues[i], someValues[i] * 10);
		}
		const merged = merge([values1, values2]);
		const actual = [];
		for await (let value of merged) {
			actual.push(value);
		}
		assert.deepEqual(actual, expected);
	}
}


@suite
export class RollupStreams {
	@test
	async simpleRollupSync() {
		const values1 = stream<{ value1: number }>(someValues.map(value1 => ({value1})));
		const values2 = stream<{ value2: number }>(function* () {
			for (let value of someValues) yield {value2: value * 10}
		});
		const expected = [];
		let expectedValue: { value1?: number, value2?: number } = {};
		for (let i = 0; i < someValuesLength; i++) {
			expected.push(expectedValue = Object.assign({}, expectedValue, {value1: i}));
			expected.push(expectedValue = Object.assign({}, expectedValue, {value2: i * 10}));
		}
		const rolledUp = rollup([values1, values2]);
		const actual = [];
		for await (let value of rolledUp) {
			actual.push(value);
		}
		assert.deepEqual(actual, expected);
	}

	@test
	async simpleRollupAsync() {
		const values1 = stream(async function* () {
			for (const value of someValues) {
				yield await delay(() => ({value1: value}));
			}
		});
		const values2 = stream(async function* () {
			for (const value of someValues) {
				yield await delay(() => ({value2: value * 10}));
			}
		});
		const expected = [];
		let expectedValue: { value1?: number, value2?: number } = {};
		for (let i = 0; i < someValuesLength; i++) {
			expected.push(expectedValue = Object.assign({}, expectedValue, {value1: i}));
			expected.push(expectedValue = Object.assign({}, expectedValue, {value2: i * 10}));
		}
		const rolledUp = rollup([values1, values2]);
		const actual = [];
		for await (let value of rolledUp) {
			actual.push(value);
		}
		assert.deepEqual(actual, expected);
	}
}

import {input} from '../f10-stream/src/input/pure-input-stream';
import '../f10-stream/src/input/into-input-stream';

@suite
export class InputStreams {

	@test
	async simpleInput() {
		const stream = input<number>().bind({});
		await Promise.all([(async () => {
			for (const value of someValues) {
				await stream(value);
			}
			await stream.return!();
		})(), (async () => {
			let result: IteratorResult<number>;
			const actual = [];
			while (!(result = await stream.next()).done) {
				actual.push(result.value);
			}
			assert.deepEqual(someValues, actual);
		})()]);
	}

	@test
	async intoInput() {
		const stream = input<number>().into(async function* (input: AsyncIterable<number>) {
			for await (const value of input) {
				yield value * 10;
			}
		}).bind({});
		await Promise.all([(async () => {
			for (const value of someValues) {
				await stream(value);
			}
			await stream.return!();
		})(), (async () => {
			let result: IteratorResult<number>;
			const actual = [];
			while (!(result = await stream.next()).done) {
				actual.push(result.value);
			}
			const expected = someValues.map(value => value * 10);
			assert.deepEqual(expected, actual);
		})()]);
	}
}

