import {Stream} from "./stream";
import {SeqConfig, SeqStream, Wrap} from "./seq-stream";

export class SharedStream<Out> extends SeqStream<Out, Wrap<Out>> {
    constructor(private stream: AsyncIterator<Out>, config: SeqConfig) {
        super(config);
    }

    protected demand() {
        return {promise: this.stream.next()};
    }
}

export function sharedStream<Out>(stream: AsyncIterator<Out>, config: SeqConfig = {}) {
    return new SharedStream<Out>(stream, config);
}

declare module './stream' {
    export interface Stream<Out> {
        share(config?: SeqConfig): SharedStream<Out>;
    }
}

Stream.prototype.share = function <Out>(config: SeqConfig = {}) {
    return new SharedStream<Out>(this[Symbol.asyncIterator](), config);
};