import assert = require("assert");
import { ValueStream } from "./value";

const ValuesCount = 0x100;
const Values = [] as number[];
for (let Value = 0; Value < ValuesCount; Value++) {
    Values.push(Value);
}

async function delay(fn: Function) {
    await fn();
}

describe('ValueStream', function () {
    it('should have a default constructor', function () {
        const value = new ValueStream<number>();
    });
    describe('Async API', function () {
        it('should pass through one value', async function () {
            const value = new ValueStream<number>();

            async function send() {
                value.in(Values[0]);
            }

            async function receive() {
                const v = await value[Symbol.asyncIterator]().next();
                assert.strictEqual(v.value, Values[0]);
            }
            await Promise.all([receive(), send()]);
        });
        it('should pass through one value which was sent earlier', async function () {
            const value = new ValueStream<number>();


            async function send() {
                value.in(Values[0]);
            }

            async function receive() {
                const v = await value[Symbol.asyncIterator]().next();
                assert.strictEqual(v.value, Values[0]);
            }
            await Promise.all([send(), receive()]);
        });
        it('should end with a close call', async function () {
            const value = new ValueStream<number>();

            async function send() {
                value.close();
            }
            async function receive() {
                for await (const _ of value) { }
            }
            await Promise.all([receive(), send()]);
        });
        it('should end with a close call, send first', async function () {
            const value = new ValueStream<number>();

            async function send() {
                value.close();
            }
            async function receive() {
                for await (const _ of value) { }
            }
            await Promise.all([send(), receive()]);
        });
        it('should end with a close call and pass-through more values, send first', async function () {
            const value = new ValueStream<number>();


            async function send() {
                for (const Value of Values) await delay(() => value.in(Value));
                value.close();
            }
            async function receive() {
                const values = [] as number[]
                for await (const v of value) {
                    values.push(v);
                }
                assert.deepEqual(values, Values);
            }
            await Promise.all([receive(), send()]);
        });
        it('should end with a close call and pass-through more values, send first', async function () {
            const value = new ValueStream<number>();


            async function send() {
                for (const Value of Values) await delay(() => value.in(Value));
                value.close();
            }
            async function receive() {
                const values = [] as number[]
                for await (const v of value) {
                    values.push(v);
                }
                assert.deepEqual(values, Values);
            }
            await Promise.all([send(), receive()]);
        });
    });
});
