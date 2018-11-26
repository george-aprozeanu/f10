import { Stream, FnErr, FnValue } from "./stream";
import { WritableStream } from './writable';

export class MergeStream<A, B> extends WritableStream<A | B> {

    constructor(private streams: [Stream<A>, Stream<B>]) {
        super();
    }

    private upstream_next = (result: IteratorResult<A | B>) => {
        this.next(result);
        this.reset();
    }

    private upstream_err = (err?: any) => {
        this.throw(err);
        this.reset();
    }

    private reset() {
        (this.streams as Stream<any>[]).forEach(stream => stream.out());
    }

    private run() {
        (this.streams as Stream<any>[]).forEach(stream => stream.out(this.upstream_next, this.upstream_err));
    }

    out(next?: FnValue<A | B>, err?: FnErr): void {
        super.out(next, err);
        if (this.fnValue) {
            this.run();
        } else {
            this.reset();
        }
    }
}

declare module './stream' {
    export interface Stream<T> {
        merge<U>(stream: Stream<U>): MergeStream<T, U>;
    }
}

Stream.prototype.merge = function <SA extends Stream<A>, A, SB extends Stream<B>, B>(this: SA, stream: SB) {
    return new MergeStream([this, stream]);
}