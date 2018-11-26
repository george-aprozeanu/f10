import { Stream } from "./stream";
import { FnErr, FnValue, Dest } from "./dest";

export class MapStream<T, U> extends Stream<U> {

    private dest = new Dest<U>();

    constructor(private stream: Stream<T>, private fn: (value: T) => U) {
        super();
    }

    private next = (result: IteratorResult<T>) => {
        const { done, value } = result;
        try {
            this.dest.next(done ? result as any : { value: this.fn(value), done });
        } catch (err) {
            this.dest.throw(err);
        }
    }

    private err = (err?: any) => {
        this.dest.throw(err);
    }

    out(next?: FnValue<U> | undefined, err?: FnErr) {
        this.dest.fill(next, err);
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