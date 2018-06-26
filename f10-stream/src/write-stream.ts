import {Value} from "./seq-stream";
import {OfferConfig, OfferStream} from "./offer-stream";

export interface Sink<T> {
	write(t: T): void;

	done(): void;
}

export const Distinct = {distinct: true};

export class WriteStream<T> extends OfferStream<T> implements Sink<T> {

	constructor(protected config: OfferConfig = {}) {
		super(config);
	}

	get value(): T | undefined {
		return this.prevValue;
	}

	set value(value: T | undefined) {
		if (value !== undefined) this.write(value);
	}

	done(returnValue?: T) {
		return this.offer({value: returnValue!, done: true});
	}

	write(value: T) {
		return this.offer({value, done: false});
	}

	update(fn: (prevValue?: T) => T) {
		return this.write(fn(this.prevValue));
	}

	protected onDemand() {
	}
}

export function writeStream<T>(config?: OfferConfig) {
	return new WriteStream<T>({...config});
}

export function valueStream<T>(config?: OfferConfig) {
	return new WriteStream<T>({...Distinct, ...Value, ...config});
}