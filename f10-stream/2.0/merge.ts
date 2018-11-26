import { Stream } from "./stream";
import { FnErr, FnValue, Dest } from "./dest";

export class MergeStream<A, B> extends Stream<A | B> {

    private dest = new Dest<A | B>();

    constructor(private a: Stream<A>, private b: Stream<B>) {
        super();
    }

    private next = (result: IteratorResult<A | B>) => {
        this.dest.next(result);
        this.reset();
    }

    private err = (err?: any) => {
        this.dest.throw(err);
        this.reset();
    }

    private reset() {
        this.a.out();
        this.b.out();
    }

    private run() {
        this.a.out(this.next, this.err);
        this.b.out(this.next, this.err);
    }

    out(next?: FnValue<T>, err?: FnErr): void {
        this.dest.fill(next, err);
        if (this.dest.canSend) {
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
    return new MergeStream(this, stream);
}