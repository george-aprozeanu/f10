import {Stream} from "./stream";

export type Resolve<Out> = (value?: Out | PromiseLike<Out>) => void;
export type Reject = (reason?: any) => void;

export interface PromiseWrap<T> {
    promise: Promise<IteratorResult<T>>;
}

export interface DefferWrap<T> extends PromiseWrap<T> {
    resolve?: Resolve<IteratorResult<T>>;
    reject?: Reject;
}

export class Seq<Out, W extends PromiseWrap<Out>> {
    constructor(readonly wrap: W, readonly next: number, public ttl: number) {
    }
}

/**
 * Sets parameters for how a SeqStream should function with regards to imperfect reads.
 */
export interface SeqConfig {
    /**
     * How many ms to keep the values in the buffer hoping for a read that has lagged behind in consuming the values.
     */
    ttl?: number;
    /**
     * How many values to replay upon starting a new read.
     *   default : Replay all values. The backlog will be limited only by the buffer size;
     *    0      : Do not replay. Only new values will be delivered. Insures the read will surely block on the first
     *           read.
     *  > 0      : Replay that many values. Entering 1 will ensure the first delivery is the last emitted value.
     */
    replay?: number;
}

export const DefaultTTL = 30000;

export const Value = {replay: 1};

export abstract class SeqStream<T, W extends PromiseWrap<T>> extends Stream<T> {

    protected last?: number;
    protected offeredSeq?: number;

    private first = 0;
    private buffer = [] as Seq<T, W>[];

    protected abstract demand(): W;

    protected constructor(protected config: SeqConfig) {
        super();
    }

    private firstReadableSeq() {
        return Math.max((this.offeredSeq || 0) - (this.config.replay || ((this.offeredSeq || 0) + 1)) + 1, 0);
    }

    [Symbol.asyncIterator]() {
        let seq = this.firstReadableSeq();
        return {
            next: () => {
                const value = this.getSeq(seq);
                seq = value.next;
                return value.wrap.promise;
            }
        };
    }

    protected getSeq(seq: number) {
        let index = this.correctSeq(seq) - this.first;
        if (index >= this.buffer.length) for (let i = this.buffer.length; i <= index; i++)
            this.buffer[i] = this.nextSeq(this.first + i);
        else this.buffer[index].ttl = Date.now() + (this.config.ttl !== undefined ? this.config.ttl : DefaultTTL);
        return this.buffer[index];
    }

    private trimTTL() {
        const now = Date.now();
        let i = 0;
        const lastIndex = Math.max(this.firstReadableSeq() - this.first, 0);
        while (i < lastIndex && this.buffer[i].ttl < now) i++;
        this.first += i;
        this.buffer.splice(0, i);
    }

    private correctSeq(seq: number) {
        seq = Math.max(seq, this.first);
        if (this.last !== undefined) seq = Math.min(seq, this.last);
        return seq;
    }

    private nextSeq(seq: number) {
        const demand = this.demand();
        demand.promise = demand.promise.then(result => {
            if (result.done) {
                this.last = seq;
                this.offeredSeq = Math.max(seq - 1, (this.offeredSeq || 0) - 1, 0);
            } else {
                this.offeredSeq = Math.max(seq, this.offeredSeq || 0);
            }
            this.trimTTL();
            return result;
        });
        const ttl = this.config.ttl !== undefined ? this.config.ttl : DefaultTTL;
        return new Seq(demand, seq + 1, Date.now() + ttl);
    }
}