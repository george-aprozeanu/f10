if (!Symbol.asyncIterator) (Symbol as any).asyncIterator = Symbol.for("Symbol.asyncIterator");

export type StreamAsyncIterable<Out> = AsyncIterable<Out> | (() => AsyncIterable<Out>);
export type StreamSyncIterable<Out> = Iterable<Out> | (() => Iterable<Out>);


export abstract class Stream<Out> implements AsyncIterable<Out> {
	abstract [Symbol.asyncIterator](): AsyncIterator<Out>;
}