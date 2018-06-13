import {SeqConfig} from "./seq-stream";
import {OfferStream} from "./offer-stream";

export class MergeStream<T> extends OfferStream<T> {

	private demanded = new Set<AsyncIterator<T>>();
	private free = new Set<AsyncIterator<T>>();
	private nextFree: Promise<AsyncIterator<T>>;

	constructor(streams: AsyncIterable<T>[], config: SeqConfig) {
		super(config);
		for (const stream of streams) this.free.add(stream[Symbol.asyncIterator]());
		if (this.free.size === 0) throw new Error("merge:zero");
		this.nextFree = Promise.resolve(this.free.values().next().value);
	}

	private async advance(iterator: AsyncIterator<T>) {
		try {
			this.demanded.add(iterator);
			const result = await iterator.next();
			this.demanded.delete(iterator);
			if (!result.done) {
				this.free.add(iterator);
				this.offer(result);
			} else if (this.demanded.size === 0 && this.free.size === 0) this.offer(result);
			return iterator;
		} catch (e) {
			console.error(e);
			return iterator;
		}
	}

	private* advanceAll() {
		for (const iterator of this.free.values()) {
			yield this.advance(iterator);
		}
	}

	private unFree = () => {
		this.nextFree = Promise.race(this.advanceAll());
		this.free.clear();
	};

	protected onDemand() {
		if (this.free.size > 0) this.unFree();
		else this.nextFree.then(this.unFree);
	}
}

export function merge<T>(streams: AsyncIterable<T>[], config: SeqConfig = {}) {
	return new MergeStream(streams, config);
}