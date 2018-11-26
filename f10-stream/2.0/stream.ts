if (!Symbol.asyncIterator) (Symbol as any).asyncIterator = Symbol.for("Symbol.asyncIterator");

export interface FnValue<T> {
    (result: IteratorResult<T>): void;
}

export interface FnErr {
    (err?: any): void;
}

export interface FnOut<T> {
    (value: FnValue<T>, err?: FnErr): void;
}

export abstract class Stream<T> implements AsyncIterable<T> {

    abstract out(next?: FnValue<T>, err?: FnErr): void

    [Symbol.asyncIterator](): AsyncIterator<T> {
        const out = this.out.bind(this);
        return { next: () => new Promise(out) }
    }
}