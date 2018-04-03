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

export abstract class SeqStream<T, W extends Wrap<T>> extends Stream<T> {

    protected last?: number;
    protected seq = 0;

    private first = 0;
    private buffer = [] as Seq<T, W>[];

    protected abstract demand(): W;


    /**
     * @param {number} size How many values to keep in the buffer.
     *   -1 : keep all values;
     *    0 : keep no values; reading from the stream always blocks;
     *  >=1 : keep that many values; reading from the stream will start with that many values replayed, but no more
     *        than set by the _replay_ param.
     *
     * @param {number} replay How many values to replay upon starting a new read.
     *   -1 : Replay all values. The backlog will be limited only by the buffer size;
     *    0 : Do not replay. Only new values will be delivered. Insures the read will surely block on the first read.
     *  > 0 : Replay that many values. Entering 1 will ensure the first delivery is the last emitted value.
     */
    constructor(private size: number = -1, private replay: number = -1) {
        super();
    }

    [Symbol.asyncIterator]() {
        let seq = this.replay > -1 ? this.seq - this.replay : 0;
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
        const maxSize = this.size + 1;
        if (maxSize > 0 && this.buffer.length > maxSize) {
            const cut = this.buffer.length - maxSize;
            this.buffer.splice(0, cut);
            this.first += cut;
        }
    }

    private correctSeq(seq: number) {
        if (seq > this.seq + 1) throw new Error("write:seq+>1");
        const oldestSeq = this.size > -1 ? Math.max(0, this.seq - this.size) : 0;
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