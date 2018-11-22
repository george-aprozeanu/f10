import {SeqConfig, SeqStream} from "./seq-stream";
import {DefferWrap, DefferWrapImpl} from "./promise";

export interface OfferConfig extends SeqConfig {
	distinct?: boolean
}

export abstract class OfferStream<T> extends SeqStream<T, DefferWrap<T>> {

	private next: number = 0;

	protected constructor(protected config: OfferConfig = {}) {
		super(config);
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
		if (this.last !== undefined) {
			if (result.done) return;
			else throw new Error("offer:done");
		}
		const next = this.getSeq(this.next);
		this.offeredSeq = this.next;
		this.next += 1;
		this.prevValue = result.value;
		next.wrap.resolve!(result);
	}
}