import { FnValue, FnErr, FnOut } from './dest';

if (!Symbol.asyncIterator) (Symbol as any).asyncIterator = Symbol.for("Symbol.asyncIterator");

export abstract class Stream<T> implements AsyncIterable<T> {

    abstract out(next?: FnValue<T>, err?: FnErr): void
    private _out: FnOut<T>

    constructor() {
        this._out = this.out.bind(this)
    }

    [Symbol.asyncIterator](): AsyncIterator<T> {
        return { next: () => new Promise(this._out) }
    }
}