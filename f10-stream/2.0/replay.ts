import { Stream, FnValue, FnErr } from './stream';
import { WritableStream } from './writable';

export class ReplayStream<T> extends WritableStream<T> {

    private result?: IteratorResult<T>;
    private thrown = false;
    private err?: any;

    constructor(private upstream: Stream<T>) {
        super();
        this.loop();
    }

    out(fnValue?: FnValue<T>, fnErr?: FnErr) {
        super.out(fnValue, fnErr);
        this.send();
    }

    private send() {
        if (this.result) {
            const result = this.result;
            delete this.result;
            this.next(result);
        } else if (this.thrown) {
            const err = this.err;
            delete this.err;
            this.thrown = false;
            this.throw(err);
        }
    }

    private upstream_next = (result: IteratorResult<T>) => {
        if (this.fnValue) {
            this.next(result);
        } else {
            this.result = result;
        }
        this.loop();
    }

    private upstream_throw = (err?: any) => {
        if (!this.fnValue) {
            this.err = err;
            this.thrown = true;
        } else {
            this.throw(err);
        }
        this.loop();
    }

    private loop() {
        this.upstream.out(this.upstream_next, this.upstream_throw);
    }
}

declare module './stream' {
    export interface Stream<T> {
        replay(): ReplayStream<T>;
    }
}

Stream.prototype.replay = function <S extends Stream<T>, T>(this: S) {
    return new ReplayStream(this);
}