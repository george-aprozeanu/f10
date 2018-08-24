import {Stream} from "./stream";
import {mapIterable, rangeUntil} from "./lib";
import {PromiseWrap} from "./promise";

export class Seq<Out, W extends PromiseWrap<Out>> {
	constructor(readonly wrap: W, readonly next: number, public ttl: number) {
	}
}

/**
 * Sets parameters for how a SeqStream should function with regards to imperfect reads.
 */
export interface SeqConfig {
	/**
	 * How many ms to keep the values in the buffer hoping for a read that has lagged behind in consuming the values.
	 */
	ttl?: number;
	/**
	 * How many values to replay upon starting a new read.
	 *   default : Replay all values. The backlog will be limited only by the buffer size;
	 *    0      : Do not replay. Only new values will be delivered. Insures the read will surely block on the first
	 *           read.
	 *  > 0      : Replay that many values. Entering 1 will ensure the first delivery is the last emitted value.
	 */
	replay?: number;
}

export const DefaultTTL = 30000;

export const Value = {replay: 1};

export abstract class SeqStream<T, W extends PromiseWrap<T>> extends Stream<T> {

	protected last?: number;
	protected offeredSeq = 0;
	protected prevValue?: T;

	private first = 0;
	private buffer = [] as Seq<T, W>[];

	public get value(): T | undefined {
		return this.prevValue;
	}

	protected constructor(protected config: SeqConfig) {
		super();
	}

	[Symbol.asyncIterator]() {
		let seq = this.config.replay !== undefined ? this.firstReadableSeq() : this.first;
		return {
			next: () => {
				const value = this.getSeq(seq);
				seq = value.next;
				return value.wrap.promise;
			}
		};
	}

	protected abstract demand(): W;

	protected getSeq(seq: number) {
		let index = this.correctSeq(seq) - this.first;
		if (index >= this.buffer.length) {
			this.buffer.push(...mapIterable(rangeUntil(this.buffer.length, index), i => this.nextSeq(this.first + i)));
		} else {
			this.buffer[index].ttl = this.newTTL();
		}
		return this.buffer[index];
	}

	private newTTL() {
		return Date.now() + (this.config.ttl !== undefined ? this.config.ttl : DefaultTTL);
	}

	private firstReadableSeq() {
		return Math.max(this.offeredSeq - (this.config.replay || 0) + 1, 0);
	}

	private trimTTL() {
		const now = Date.now();
		let i = 0;
		const first = this.firstReadableSeq();
		const lastIndex = Math.max(first - this.first, 0);
		while (i < lastIndex && this.buffer[i].ttl < now) i++;
		this.first += i;
		this.buffer.splice(0, i);
	}

	private correctSeq(seq: number) {
		seq = Math.max(seq, this.first);
		if (this.last !== undefined) seq = Math.min(seq, this.last);
		return seq;
	}

	private nextSeq(seq: number) {
		const demand = this.demand();
		demand.promise.then(result => {
			if (result.done) {
				this.last = seq;
				this.offeredSeq = Math.max(seq, this.offeredSeq, 1) - 1;
			} else {
				this.prevValue = result.value;
				this.offeredSeq = Math.max(seq, this.offeredSeq);
			}
			this.trimTTL();
			return result;
		});
		return new Seq(demand, seq + 1, this.newTTL());
	}
}