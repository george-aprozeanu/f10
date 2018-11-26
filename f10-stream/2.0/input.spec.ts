import { InputStream } from "./input";
import assert from 'assert';

async function delay(fn: Function) {
    await fn();
}

const ValuesCount = 0x100;
const Values = [] as number[];
for (let Value = 0; Value < ValuesCount; Value++) {
    Values.push(Value);
}

describe('InputStream', function () {
    it('should have a default ctor', function () {
        new InputStream<number>();
    });
    describe('Async API', function () {
        it('should pass-through at least one value', async function () {
            const input = new InputStream<number>();
            async function send() {
                input.in(Values[0]);
            }
            async function receive() {
                const v = await input[Symbol.asyncIterator]().next();
                assert.strictEqual(v.value, Values[0]);
            }
            await Promise.all([receive(), send()]);
        });
        /** 
         * Sending more values synchronously to the same input will
         * naturally overwrite the values until the last send with
         * an async consumer.
         * 
         * AsyncIterator is always an async consumer.
         * 
         * We simulate the sending of async values only.
         */
        it('should pass-through more values', async function () {
            const input = new InputStream<number>();
            async function send() {
                for (const Value of Values) await delay(() => input.in(Value));
            }
            async function receive() {
                const values = [] as number[];
                for await (const value of input) {
                    values.push(value);
                    if (values.length === Values.length) break; // avoids needing to end the stream
                }
                return assert.deepEqual(values, Values);
            }
            await Promise.all([receive(), send()]);
        });
        it('should end with a close call', async function () {
            const input = new InputStream<number>();
            async function send() {
                input.close();
            }
            async function receive() {
                for await (const _ of input) { }
            }
            await Promise.all([receive(), send()]);
        });
        it('should end with a close call and pass-through more values', async function () {
            const input = new InputStream<number>();
            async function send() {
                for (const Value of Values) await delay(() => input.in(Value));
                input.close();
            }
            async function receive() {
                const values = [] as number[]
                for await (const value of input) {
                    values.push(value);
                }
                assert.deepEqual(values, Values);
            }
            await Promise.all([receive(), send()]);
        });
        it('should perform with minimal overhead', async function () {
            const ValuesCount = 0x2000;
            const Values = [] as number[];
            for (let Value = 0; Value < ValuesCount; Value++) {
                Values.push(Value);
            }
            async function collectWithout() {
                const values = [] as number[];
                // for-await compensates for the required for-await when reading from an input-stream
                for await (const value of Values) {
                    // the await-delay compensates for the required async way input-stream values are produced
                    await delay(() => values.push(value));
                }
                assert.deepEqual(values, Values);
            }
            async function collectWithStream() {
                const input = new InputStream<number>();
                async function send() {
                    for (const Value of Values) await delay(() => input.in(Value));
                    input.close();
                }
                async function receive() {
                    const values = [] as number[]
                    for await (const value of input) {
                        values.push(value);
                    }
                    assert.deepEqual(values, Values);
                }
                await Promise.all([receive(), send()]);
            }

            let start = Date.now();
            await collectWithout();
            const withoutTime = Date.now() - start;

            start = Date.now();
            await collectWithStream();
            const withStreamTime = Date.now() - start;

            const result = withStreamTime / withoutTime - 1;
            assert(result < 0.2, `The overhead was ${Math.floor(result * 10000) / 100}% > 20%`);
        });
    });
});