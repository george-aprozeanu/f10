import {Stream} from "./stream";
import {ExecutableStream} from "./executable-stream";

export interface CategoryResult<Cat, Out> {
    category: Cat;
    value: Out;
    done: boolean;
}

export class MuxStream<Cat, Out> extends ExecutableStream<CategoryResult<Cat, Out>> {

    private streams = new Map<Cat, AsyncIterator<Out>>();

    constructor(attachments: Map<Cat, Stream<Out>>) {
        super();
        for (let [category, stream] of attachments.entries()) this.attach(category, stream);
    }

    attach(category: Cat, stream: AsyncIterable<Out>) {
        if (this.streams.has(category)) throw new Error('mux:cat==cat');
        this.streams.set(category, stream[Symbol.asyncIterator]());
    }

    detach(category: Cat) {
        const iterator = this.streams.get(category);
        if (iterator) {
            iterator.return && iterator.return();
            this.streams.delete(category);
        }
    }

    async* main(): AsyncIterator<CategoryResult<Cat, Out>> {
        while(this.streams.size > 0) {
            for (let [category, iterator] of this.streams.entries()) {
                const {value, done} = await iterator.next();
                if (done) this.detach(category);
                yield {category, value, done};
            }
        }
    }
}

export function mux<Cat, Out>(attachments: Map<Cat, Stream<Out>> = new Map()) {
    return new MuxStream<Cat, Out>(attachments);
}

