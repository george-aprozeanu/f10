import { FnErr, FnValue, Stream } from "./stream";
import {WritableStream} from './writable';

export interface ChainFn<A, B> {
    (value: A, next: FnValue<B>, err: FnErr): void
}

export class ChainStream<T, U> extends WritableStream<U> {

    constructor(private stream: Stream<T>, private fn: ChainFn<T, U>) {
        super();
    }

    private err = this.throw.bind(this);

    private upstream_next = (result: IteratorResult<T>) => {
        const { done, value } = result;
        try {
            if (!done) {
                this.fn(value, this.next, this.err);
            } else {
                this.next(result as any);
            }
        } catch (err) {
            this.throw(err);
        }
    }

    out(next?: FnValue<U> | undefined, err?: FnErr) {
        super.out(next, err);
        this.stream.out(this.upstream_next, this.err);
    }
}

declare module './stream' {
    export interface Stream<T> {
        chain<U>(fn: (value: T) => U): ChainStream<T, U>;
    }
}

Stream.prototype.chain = function <SA extends Stream<A>, A, B>(this: SA, fn: ChainFn<A, B>) {
    return new ChainStream(this, fn);
}