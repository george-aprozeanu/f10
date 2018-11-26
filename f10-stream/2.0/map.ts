import { FnErr, FnValue, Stream } from "./stream";
import { WritableStream } from './writable';

export class MapStream<T, U> extends WritableStream<U> {

    constructor(private stream: Stream<T>, private fn: (value: T) => U) {
        super();
    }

    private upstream_next = (result: IteratorResult<T>) => {
        const { done, value } = result;
        try {
            this.next(done ? result as any : { value: this.fn(value), done });
        } catch (err) {
            this.throw(err);
        }
    }

    out(next?: FnValue<U> | undefined, err?: FnErr) {
        super.out(next, err);
        this.stream.out(this.upstream_next, this.throw);
    }
}

declare module './stream' {
    export interface Stream<T> {
        map<U>(fn: (value: T) => U): MapStream<T, U>;
    }
}

Stream.prototype.map = function <SA extends Stream<A>, A, B>(this: SA, fn: (value: A) => B) {
    return new MapStream(this, fn);
}