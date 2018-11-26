import { FnValue, FnErr, Dest } from './dest';
import { Stream } from './stream';
import { Result } from './result';

export class ReplayStream<T> extends Stream<T> {

    private result = new Result<T>();
    private dest = new Dest<T>();

    constructor(private upstream: Stream<T>) {
        super();
        this.loop();
    }

    out(next?: FnValue<T>, err?: FnErr) {
        this.dest.fill(next, err);
        if (this.result.canSend && this.dest.canSend) this.result.send(this.dest);
    }

    private next = (result: IteratorResult<T>) => {
        this.result.set(result);
        if (this.dest.canSend) this.result.send(this.dest);
        this.loop();
    }

    private throw = (err?: any) => {
        this.result.setErr(err);
        if (this.dest.canSend) this.result.send(this.dest);
        this.loop();
    }

    private loop() {
        this.upstream.out(this.next, this.throw);
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