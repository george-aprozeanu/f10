import {Stream} from "./stream";

export type Resolve<Out> = (value?: Out | PromiseLike<Out>) => void;
export type Reject = (reason?: any) => void;

export interface Wrap<T> {
    promise: Promise<IteratorResult<T>>;
}

export interface DefferWrap<T> extends Wrap<T> {
    resolve?: Resolve<IteratorResult<T>>;
    reject?: Reject;
}

export class Seq<Out, W extends Wrap<Out>> {
    constructor(readonly wrap: W, readonly next: number) {
    }
}

/**
 * Sets parameters for how a SeqStream should function with regards to imperfect reads.
 */
export interface SeqConfig {
    /**
     * How many values to keep in the buffer.
     * default  : keep all values;
     *    0     : keep no values; reading from the stream always blocks;
     *  >=1     : keep that many values; reading from the stream will start with that many values replayed, but no more
     *              than set by the _replay_ param.
     */
    size?: number;
    /**
     * How many values to replay upon starting a new read.
     *   default : Replay all values. The backlog will be limited only by the buffer size;
     *    0      : Do not replay. Only new values will be delivered. Insures the read will surely block on the first
     *           read.
     *  > 0      : Replay that many values. Entering 1 will ensure the first delivery is the last emitted value.
     */
    replay?: number;
}

export const Value = {replay: 1};

export abstract class SeqStream<T, W extends Wrap<T>> extends Stream<T> {

    protected last?: number;
    protected seq = 0;

    private first = 0;
    private buffer = [] as Seq<T, W>[];

    protected abstract demand(): W;

    constructor(protected config: SeqConfig) {
        super();
    }

    [Symbol.asyncIterator]() {
        let seq = this.config.replay !== undefined ? this.seq - this.config.replay : 0;
        return {
            next: () => {
                if (seq > this.seq) throw new Error("read:seq!>");
                const value = this.getSeq(seq);
                seq = value.next;
                return value.wrap.promise;
            }
        };
    }

    protected getSeq(seq: number) {
        seq = this.correctSeq(seq);
        let index = seq - this.first;
        if (!this.buffer[index]) this.nextSeq(seq, index);
        const ret = this.buffer[index];
        this.trim();
        return ret;
    }

    private trim() {
        const maxSize = this.config.size !== undefined ? (this.config.size + 1) : undefined;
        if (maxSize !== undefined && this.buffer.length > maxSize) {
            const cut = this.buffer.length - maxSize;
            this.buffer.splice(0, cut);
            this.first += cut;
        }
    }

    private correctSeq(seq: number) {
        if (seq > this.seq + 1) throw new Error("write:seq+>1");
        const oldestSeq = this.config.size !== undefined ? Math.max(0, this.seq - this.config.size) : 0;
        seq = Math.max(seq, oldestSeq);
        if (this.last !== undefined) seq = Math.min(seq, this.last);
        return seq;
    }

    private nextSeq(seq: number, index: number) {
        const demand = this.demand();
        const next = seq + 1;
        demand.promise = demand.promise.then(result => {
            if (result.done) this.last = seq;
            else this.seq = next;
            return result;
        });
        this.buffer[index] = new Seq(demand, next);
    }
}