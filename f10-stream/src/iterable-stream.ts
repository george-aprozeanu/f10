import {Stream, StreamAsyncIterable, StreamSyncIterable} from "./stream";
import {ExecutableStream} from "./executable-stream";

export type StreamIterable<Out> = StreamAsyncIterable<Out> | StreamSyncIterable<Out>;
export type StreamFn<Out> = () => (Iterable<Out> | AsyncIterable<Out>);

export class IterableStream<Out> extends ExecutableStream<Out> {

	constructor(private fn: StreamFn<Out>) {
		super();
	}

	[Symbol.asyncIterator](): AsyncIterator<Out> {
		return this.main();
	}

	async* main() {
		yield* this.fn();
	}
}

export function stream<Out>(iterable: StreamIterable<Out>): Stream<Out> {
	return new IterableStream(typeof iterable === "function" ? iterable : () => iterable);
}