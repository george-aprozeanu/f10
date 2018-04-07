import {Stream} from "./stream";
import {ExecutableStream} from "./executable-stream";

export interface RollupConfig {
    syncFirst?: boolean
}

export class RollupStream<Cat, Out> extends ExecutableStream<Map<Cat, Out>> {

    private streams = new Map<Cat, AsyncIterator<Out>>();

    constructor(attachments: Map<Cat, AsyncIterable<Out>>, protected config: RollupConfig) {
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

    async* main(): AsyncIterator<Map<Cat, Out>> {
        const values = new Map<Cat, Out>();
        let synced = !this.config.syncFirst;
        while (this.streams.size > 0) {
            let toSync = this.streams.size;
            for (let [category, iterator] of this.streams.entries()) {
                const {value, done} = await iterator.next();
                toSync = toSync - 1;
                if (done) {
                    this.detach(category);
                } else {
                    values.set(category, value);
                    if (this.streams.size > 0 && (synced || toSync === 0)) {
                        yield new Map(values.entries());
                    }
                }
            }
            synced = true;
        }
    }
}

export function rollup<Cat, Out>(attachments: Map<Cat, AsyncIterable<Out>> = new Map(), config: RollupConfig = {}) {
    return new RollupStream(attachments, config);
}