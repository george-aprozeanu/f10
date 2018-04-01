export type Resolve<Out> = (value?: Out | PromiseLike<Out>) => void;
export type Reject = (reason?: any) => void;

export type StreamAsyncIterable<Out> = AsyncIterable<Out> | (() => AsyncIterable<Out>);
export type StreamSyncIterable<Out> = Iterable<Out> | (() => Iterable<Out>);
export type StreamIterable<Out> = StreamAsyncIterable<Out> | StreamSyncIterable<Out>;
export type StreamFn<Out> = () => (Iterable<Out> | AsyncIterable<Out>);
