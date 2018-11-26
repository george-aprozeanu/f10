import { InputStream } from "./input";
import "./replay";
import assert = require("assert");
import { ReplayStream } from "../replay-stream";

const ValuesCount = 0x100;
const Values = [] as number[];
for (let Value = 0; Value < ValuesCount; Value++) {
    Values.push(Value);
}

async function delay(fn: Function) {
    await fn();
}

describe('ReplayStream', function () {
    it('should build based on another stream', function () {
        const input = new InputStream<number>();
        input.replay();
    });
    describe('Async API', function() {
        it('should pass through one value', async function() {
                const input = new InputStream<number>();
                const replay = input.replay();

                async function send() {
                    input.in(Values[0]);
                }

                async function receive() {
                    const v = await replay[Symbol.asyncIterator]().next();
                    assert.strictEqual(v.value, Values[0]);
                }
                await Promise.all([receive(), send()]);
        });
        it('should pass through one value which was sent earlier', async function() {
                const input = new InputStream<number>();
				const replay = input.replay();

                async function send() {
                    input.in(Values[0]);
                }

                async function receive() {
                    const v = await replay[Symbol.asyncIterator]().next();
                    assert.strictEqual(v.value, Values[0]);
                }
                await Promise.all([send(), receive()]);
        });
        it('should end with a close call', async function () {
            const input = new InputStream<number>();
            const replay = input.replay();
            async function send() {
                input.close();
            }
            async function receive() {
                for await (const _ of replay) { }
            }
            await Promise.all([receive(), send()]);
        }); 
        it('should end with a close call, send first', async function () {
            const input = new InputStream<number>();
            const replay = input.replay();
            async function send() {
                input.close();
            }
            async function receive() {
                for await (const _ of replay) { }
            }
            await Promise.all([send(), receive()]);
        }); 
        it('should end with a close call and pass-through more values, send first', async function () {
            const input = new InputStream<number>();
            const replay = input.replay();

            async function send() {
                for (const Value of Values) await delay(() => input.in(Value));
                input.close();
            }
            async function receive() {
                const values = [] as number[]
                for await (const value of replay) {
                    values.push(value);
                }
                assert.deepEqual(values, Values);
            }
            await Promise.all([receive(), send()]);
        });
        it('should end with a close call and pass-through more values, send first', async function () {
            const input = new InputStream<number>();
            const replay = input.replay();

            async function send() {
                for (const Value of Values) await delay(() => input.in(Value));
                input.close();
            }
            async function receive() {
                const values = [] as number[]
                for await (const value of replay) {
                    values.push(value);
                }
                assert.deepEqual(values, Values);
            }
            await Promise.all([send(), receive()]);
        });
    });
 });
