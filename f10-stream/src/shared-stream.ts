import {Stream} from "./stream";
import {SeqStream, Wrap} from "./seq-stream";

export class SharedStream<Out> extends SeqStream<Out, Wrap<Out>> {
    constructor(private stream: AsyncIterator<Out>, size: number = -1, replay: number = 1) {
        super(size, replay);
    }

    protected demand() {
        return {promise: this.stream.next()};
    }
}

export function sharedStream<Out>(stream: AsyncIterator<Out>) {
    return new SharedStream<Out>(stream);
}

declare module './stream' {
    export interface Stream<Out> {
        share(size?: number, replay?: number): SharedStream<Out>;
    }
}

Stream.prototype.share = function <Out>(size: number = -1, replay: number = 1) {
    return new SharedStream<Out>(this[Symbol.asyncIterator](), size, replay);
};