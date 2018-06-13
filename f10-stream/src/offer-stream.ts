import {DefferWrap, DefferWrapImpl, SeqConfig, SeqStream} from "./seq-stream";

export interface OfferConfig extends SeqConfig {
	distinct?: boolean
}

export abstract class OfferStream<T> extends SeqStream<T, DefferWrap<T>> {

	protected prevValue?: T;
	private next: number = 0;

	protected constructor(protected config: OfferConfig = {}) {
		super(config);
	}

	public get value(): T | undefined {
		return this.prevValue;
	}

	protected demand(): DefferWrap<T> {
		const demand = new DefferWrapImpl<T>();
		this.onDemand(demand);
		return demand;
	}

	protected abstract onDemand(demand: DefferWrap<T>): void;

	protected offer(result: IteratorResult<T>) {
		if (this.config.distinct) {
			if (this.prevValue !== undefined && !result.done && result.value === this.prevValue) return;
		}
		this.prevValue = result.value;
		if (this.last !== undefined) {
			if (result.done) return;
			else throw new Error("offer:done");
		}
		const next = this.getSeq(this.next);
		this.offeredSeq = this.next;
		this.next += 1;
		next.wrap.resolve!(result);
	}
}