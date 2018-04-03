import {DefferWrap, Reject, Resolve, SeqStream} from "./seq-stream";

export class WriteStream<T> extends SeqStream<T, DefferWrap<T>> {

    private prevSeq = -1;
    private prevValue?: T;

    constructor(private distinct: boolean = true, size: number = -1, replay: number = 1) {
        super(size, replay);
    }

    done(returnValue?: T) {
        return this.offer({value: returnValue!, done: true});
    }

    write(value: T) {
        return this.offer({value, done: false});
    }

    update(fn: (prevValue?: T) => T) {
        return this.write(fn(this.prevValue));
    }

    get value(): T {
        return this.prevValue!;
    }

    set value(value: T) {
        this.write(value).catch(console.error);
    }

    protected demand() {
        let resolve: Resolve<IteratorResult<T>>;
        let reject: Reject;
        const wrap: DefferWrap<T> = {
            promise: new Promise<IteratorResult<T>>((_resolve, _reject) => {
                resolve = _resolve;
                reject = _reject;
            })
        };
        wrap.resolve = resolve!;
        wrap.reject = reject!;
        return wrap;
    }

    private async offer(result: IteratorResult<T>) {
        if (this.seq === this.prevSeq && this.seq !== this.last) throw new Error("write:!await");
        if (this.distinct) {
            if (this.prevValue !== undefined && !result.done && result.value === this.prevValue) return;
        }
        this.prevValue = result.value;
        this.prevSeq = this.seq;
        if (this.last !== undefined) {
            if (result.done) return;
            else throw new Error("write:done");
        }
        const next = this.getSeq(this.seq);
        next.wrap.resolve!(result);
        await next.wrap.promise;
    }
}

export function writeStream<T>(distinct: boolean = true, size: number = -1, replay: number = 1) {
    return new WriteStream<T>(distinct, size, replay);
}
