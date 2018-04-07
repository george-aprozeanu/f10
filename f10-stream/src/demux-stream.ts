import {Stream} from "./stream";
import {Sink, WriteConfig} from "./write-stream";
import {WriteStream} from "./write-stream";

export interface Qualifier<Cat, T> {
    (value: T): Cat | undefined;
}

export interface DemuxConfig extends WriteConfig {
    streamUnqualified?: boolean;
}

export class DemuxStream<Cat, Out> implements Sink<Out> {

    private streams = new Map<Cat, WriteStream<Out>>();
    private unqualified?: WriteStream<Out>;

    constructor(protected qualifier: Qualifier<Cat, Out>, protected config: DemuxConfig) {
    }

    private getCat(cat: Cat) {
        if (!this.streams.has(cat)) this.streams.set(cat, new WriteStream<Out>(this.config));
        return this.streams.get(cat)!;
    }

    getUnqualified() {
        if (!this.unqualified) this.unqualified = new WriteStream<Out>(this.config);
        return this.unqualified;
    }

    write(value: Out) {
        const cat = this.qualifier(value);
        if (cat !== undefined) return this.getCat(cat).write(value);
        else if (this.config.streamUnqualified) {
            return this.getUnqualified().write(value);
        }
    }

    done() {
        for (let stream of this.streams.values()) stream.done();
    }

    get(cat: Cat): Stream<Out> {
        return this.getCat(cat);
    }
}

export function demux<Cat, Out>(qualifier: Qualifier<Cat, Out>, config: DemuxConfig = {}) {
    return new DemuxStream<Cat, Out>(qualifier, config);
}

export function demuxValue<Cat, Out>(qualifier: Qualifier<Cat, Out>, config: DemuxConfig = {}) {
    return new DemuxStream<Cat, Out>(qualifier, {replay: 1, distinct: true, ...config});
}