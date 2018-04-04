import {DefferWrap, Reject, Resolve, SeqConfig, SeqStream, Value} from "./seq-stream";

export interface Sink<T> {
    write(t: T): Promise<void>;
    done(): Promise<void>;
}

export interface WriteConfig extends SeqConfig {
    distinct?: boolean;
}

export const Distinct = {distinct: true};

export class WriteStream<T> extends SeqStream<T, DefferWrap<T>> implements Sink<T> {


    private prevSeq = -1;
    private prevValue?: T;

    constructor(protected config: WriteConfig) {
        super(config);
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
        if (this.config.distinct) {
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

export function writeStream<T>(config?: WriteConfig) {
    return new WriteStream<T>({...config});
}

export function valueStream<T>(config?: WriteConfig) {
    return new WriteStream<T>({...Distinct, ...Value, ...config});
}