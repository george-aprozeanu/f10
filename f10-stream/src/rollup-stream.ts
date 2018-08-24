import {SeqConfig} from "./seq-stream";
import {OfferStream} from "./offer-stream";

export class RollupStream<T extends object> extends OfferStream<T> {

	protected prevValue?: T;

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
		if (this.free.size === 0) throw new Error("rollup:zero");
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
				const value = Object.assign({}, this.prevValue, result.value);
				this.offer({value, done: false});
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

export function rollup<T1 extends object, T2 extends object>(streams: [
		AsyncIterable<T1>,
		AsyncIterable<T2>], config?: SeqConfig): RollupStream<T1 & T2>;
export function rollup<T1 extends object, T2 extends object, T3 extends object>(streams: [
		AsyncIterable<T1>,
		AsyncIterable<T2>,
		AsyncIterable<T3>], config?: SeqConfig): RollupStream<T1 & T2 & T3>;
export function rollup<T1 extends object, T2 extends object, T3 extends object, T4 extends object>(streams: [
		AsyncIterable<T1>,
		AsyncIterable<T2>,
		AsyncIterable<T3>,
		AsyncIterable<T4>], config?: SeqConfig): RollupStream<T1 & T2 & T3 & T4>;
export function rollup<T1 extends object, T2 extends object, T3 extends object,
		T4 extends object, T5 extends object>(streams: [
		AsyncIterable<T1>,
		AsyncIterable<T2>,
		AsyncIterable<T3>,
		AsyncIterable<T4>,
		AsyncIterable<T5>], config?: SeqConfig): RollupStream<T1 & T2 & T3 & T4 & T5>;
export function rollup<T1 extends object, T2 extends object, T3 extends object, T4 extends object,
		T5 extends object, T6 extends object>(streams: [
		AsyncIterable<T1>,
		AsyncIterable<T2>,
		AsyncIterable<T3>,
		AsyncIterable<T4>,
		AsyncIterable<T5>,
		AsyncIterable<T6>], config?: SeqConfig): RollupStream<T1 & T2 & T3 & T4 & T5 & T6>;
export function rollup<T1 extends object, T2 extends object, T3 extends object, T4 extends object,
		T5 extends object, T6 extends object, T7 extends object>(streams: [
		AsyncIterable<T1>,
		AsyncIterable<T2>,
		AsyncIterable<T3>,
		AsyncIterable<T4>,
		AsyncIterable<T5>,
		AsyncIterable<T6>,
		AsyncIterable<T7>], config?: SeqConfig): RollupStream<T1 & T2 & T3 & T4 & T5 & T6 & T7>;

export function rollup<T extends object>(streams: AsyncIterable<T>[], config: SeqConfig = {}) {
	return new RollupStream<T>(streams, config);
}