export declare type Resolve<Out> = (value?: Out | PromiseLike<Out>) => void;
export declare type Reject = (reason?: any) => void;
export declare type StreamAsyncIterable<Out> = AsyncIterable<Out> | (() => AsyncIterable<Out>);
export declare type StreamSyncIterable<Out> = Iterable<Out> | (() => Iterable<Out>);
export declare type StreamIterable<Out> = StreamAsyncIterable<Out> | StreamSyncIterable<Out>;
export declare type StreamFn<Out> = () => (Iterable<Out> | AsyncIterable<Out>);
