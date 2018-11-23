if (!Symbol.asyncIterator) (Symbol as any).asyncIterator = Symbol.for("Symbol.asyncIterator");

export interface NextFn<T> {
    (result: IteratorResult<T>): void
}

export interface ErrFn {
    (err?: any): void
}

export interface OutFn<T> {
    (next: NextFn<T>, err?: ErrFn): void;
}

export interface ForwardStream<T> {
    next: NextFn<T>
    err?: ErrFn
}

export abstract class Stream<T> implements AsyncIterable<T> {

    abstract out(next: NextFn<T>, err?: ErrFn): void
    private _out: OutFn<T>

    constructor() {
        this._out = this.out.bind(this)
    }

    [Symbol.asyncIterator](): AsyncIterator<T> {
        return { next: () => new Promise(this._out) }
    }
}