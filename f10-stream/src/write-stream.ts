import {DefferWrap, Reject, Resolve, SeqConfig, SeqStream, Value} from "./seq-stream";

export interface Sink<T> {
    write(t: T): void;

    done(): void;
}

export interface WriteConfig extends SeqConfig {
    distinct?: boolean;
}

export const Distinct = {distinct: true};

export class WriteStream<T> extends SeqStream<T, DefferWrap<T>> implements Sink<T> {

    private prevValue?: T;
    private next: number = 0;

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
        this.write(value);
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

    private offer(result: IteratorResult<T>) {
        if (this.config.distinct) {
            if (this.prevValue !== undefined && !result.done && result.value === this.prevValue) return;
        }
        this.prevValue = result.value;
        if (this.last !== undefined) {
            if (result.done) return;
            else throw new Error("write:done");
        }
        const next = this.getSeq(this.next);
        this.offeredSeq = this.next;
        this.next += 1;
        next.wrap.resolve!(result);
    }
}

export function writeStream<T>(config?: WriteConfig) {
    return new WriteStream<T>({...config});
}

export function valueStream<T>(config?: WriteConfig) {
    return new WriteStream<T>({...Distinct, ...Value, ...config});
}