import {SeqConfig} from "./seq-stream";
import {OfferStream} from "./offer-stream";

export class MergeStream<T> extends OfferStream<T> {

	private demanded = new Set<AsyncIterator<T>>();
	private free = new Set<AsyncIterator<T>>();
	private nextFree: Promise<AsyncIterator<T>>;
	private unFree = () => {
		this.nextFree = Promise.race(this.advanceAll());
		this.free.clear();
	};

	constructor(streams: AsyncIterable<T>[], config: SeqConfig) {
		super(config);
		for (const stream of streams) this.free.add(stream[Symbol.asyncIterator]());
		if (this.free.size === 0) throw new Error("merge:zero");
		this.nextFree = Promise.resolve(this.free.values().next().value);
	}

	protected onDemand() {
		if (this.free.size > 0) this.unFree();
		else this.nextFree.then(this.unFree);
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
}

export function merge<T1, T2>(streams: [
	AsyncIterable<T1>,
	AsyncIterable<T2>], config?: SeqConfig): MergeStream<T1 | T2>;
export function merge<T1, T2, T3>(streams: [
	AsyncIterable<T1>,
	AsyncIterable<T2>,
	AsyncIterable<T3>], config?: SeqConfig): MergeStream<T1 | T2 | T3>;
export function merge<T1, T2, T3, T4>(streams: [
	AsyncIterable<T1>,
	AsyncIterable<T2>,
	AsyncIterable<T3>,
	AsyncIterable<T4>], config?: SeqConfig): MergeStream<T1 | T2 | T3 | T4>;
export function merge<T1, T2, T3, T4, T5>(streams: [
	AsyncIterable<T1>,
	AsyncIterable<T2>,
	AsyncIterable<T3>,
	AsyncIterable<T4>,
	AsyncIterable<T5>], config?: SeqConfig): MergeStream<T1 | T2 | T3 | T4 | T5>;
export function merge<T1, T2, T3, T4, T5, T6>(streams: [
	AsyncIterable<T1>,
	AsyncIterable<T2>,
	AsyncIterable<T3>,
	AsyncIterable<T4>,
	AsyncIterable<T5>,
	AsyncIterable<T6>], config?: SeqConfig): MergeStream<T1 | T2 | T3 | T4 | T5 | T6>;
export function merge<T1, T2, T3, T4, T5, T6, T7>(streams: [
	AsyncIterable<T1>,
	AsyncIterable<T2>,
	AsyncIterable<T3>,
	AsyncIterable<T4>,
	AsyncIterable<T5>,
	AsyncIterable<T6>,
	AsyncIterable<T7>], config?: SeqConfig): MergeStream<T1 | T2 | T3 | T4 | T5 | T6 | T7>;
export function merge<T>(streams: AsyncIterable<T>[], config: SeqConfig = {}) {
	return new MergeStream(streams, config);
}