import {DefferWrap, DefferWrapImpl, SeqConfig, SeqStream} from "./seq-stream";

export class MergeStream<T> extends SeqStream<T, DefferWrap<T>> {

	private demanded = new Set<AsyncIterator<T>>();
	private free = new Set<AsyncIterator<T>>();
	private next = 0;

	constructor(streams: AsyncIterable<T>[], config: SeqConfig) {
		super(config);
		for (const stream of streams) this.free.add(stream[Symbol.asyncIterator]());
	}

	private errorFrom(iterator: AsyncIterator<T>) {
		return (failure: Error) => {
			this.demanded.delete(iterator);
			console.error(failure);
		}
	}

	private offerFrom(iterator: AsyncIterator<T>) {
		return (result: IteratorResult<T>) => {
			this.demanded.delete(iterator);
			if (!result.done) {
				this.free.add(iterator);
				const next = this.getSeq(this.next);
				this.offeredSeq = this.next;
				this.next += 1;
				next.wrap.resolve!(result);
			} else {
				if (this.demanded.size === 0 && this.free.size === 0) {
					const next = this.getSeq(this.next);
					this.offeredSeq = this.next;
					next.wrap.resolve!(result);
				}
			}
		};
	}

	protected demand(): DefferWrap<T> {
		for (const iterator of this.free) {
			this.demanded.add(iterator);
			iterator.next().then(this.offerFrom(iterator), this.errorFrom(iterator));
		}
		this.free.clear();
		return new DefferWrapImpl<T>();
	}
}

export function mergeStream<T>(streams: AsyncIterable<T>[], config: SeqConfig = {}) {
	return new MergeStream(streams, config);
}