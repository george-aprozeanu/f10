import { Reject, Resolve, StreamFn, StreamIterable } from "./stream-type";
export declare abstract class Stream<Out> implements AsyncIterable<Out> {
    abstract [Symbol.asyncIterator](): AsyncIterator<Out>;
}
export declare abstract class ExecutableStream<Out> extends Stream<Out> {
    abstract main(): AsyncIterator<Out>;
    [Symbol.asyncIterator](): AsyncIterator<Out>;
}
export declare class IterableStream<Out> extends ExecutableStream<Out> {
    private fn;
    constructor(fn: StreamFn<Out>);
    [Symbol.asyncIterator](): AsyncIterator<Out>;
    main(): AsyncIterableIterator<Out>;
}
export declare function stream<Out>(iterable: StreamIterable<Out>): Stream<Out>;
export interface Wrap<T> {
    promise: Promise<IteratorResult<T>>;
}
export declare class Seq<Out, W extends Wrap<Out>> {
    readonly wrap: W;
    readonly next: number;
    constructor(wrap: W, next: number);
}
export interface DefferWrap<T> extends Wrap<T> {
    resolve?: Resolve<IteratorResult<T>>;
    reject?: Reject;
}
export declare abstract class SeqStream<T, W extends Wrap<T>> extends Stream<T> {
    private size;
    private replay;
    protected last?: number;
    protected seq: number;
    private first;
    private buffer;
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
    constructor(size?: number, replay?: number);
    [Symbol.asyncIterator](): {
        next: () => Promise<IteratorResult<T>>;
    };
    protected getSeq(seq: number): Seq<T, W>;
    private trim();
    private correctSeq(seq);
    private nextSeq(seq, index);
}
export declare class WriteStream<T> extends SeqStream<T, DefferWrap<T>> {
    private distinct;
    private prevSeq;
    private prevValue?;
    constructor(distinct?: boolean, size?: number, replay?: number);
    done(returnValue?: T): Promise<void>;
    write(value: T): Promise<void>;
    update(fn: (prevValue?: T) => T): Promise<void>;
    value: T;
    protected demand(): DefferWrap<T>;
    private offer(result);
}
export declare function writeStream<T>(distinct?: boolean, size?: number, replay?: number): WriteStream<T>;
export declare class SharedStream<Out> extends SeqStream<Out, Wrap<Out>> {
    private sharedStream;
    private iterator?;
    constructor(sharedStream: Stream<Out>, size?: number, replay?: number);
    protected demand(): {
        promise: Promise<IteratorResult<Out>>;
    };
}
export interface Stream<Out> {
    share(size: number, replay: number): SharedStream<Out>;
}
