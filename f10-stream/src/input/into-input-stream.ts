import {deffer} from "../promise";
import {InputStream, InputStreamCall, InputStreamRun} from "./input-stream";

export interface IntoFn<In, Out, This> {
	(this: This, input: AsyncIterable<Out>): AsyncIterableIterator<Out>
}

declare module './input-stream' {
	export interface InputStream<In, Out, This> {
		into<NewOut>(this: this, fn: IntoFn<Out, NewOut, This>): IntoInputStream<In, Out, NewOut, This>;
	}
}

InputStream.prototype.into = function <In, Out, This, NewOut>(fn: IntoFn<Out, NewOut, This>) {
	return new IntoInputStream<In, Out, NewOut, This>(this, fn);
};

class IntoInputStreamRun<In, PrevOut, Out, This> implements InputStreamRun<In, Out, This> {

	protected iterator: AsyncIterator<Out>;
	private pressure = deffer();

	constructor(context: This, private upstream: InputStreamRun<In, PrevOut, This>, fn: IntoFn<PrevOut, Out, This>) {
		this.iterator = this.iterate(context, upstream, fn);
	}

	call(context: This): InputStreamCall<In, This> {
		const self = this;
		const upstream = this.upstream.call(context);
		return async function (this: This, value: In) {
			self.pressure = deffer();
			await upstream.call(this, value);
			await self.pressure;
		};
	}

	next(value?: any): Promise<IteratorResult<Out>> {
		return this.iterator.next(value);
	}

	async return(val?: any) {
		this.pressure.resolve();
		const {value, done} = await this.upstream.return(val);
		return {value: value as any, done};
	}

	async throw(e?: any) {
		this.pressure.resolve();
		const {value, done} = await this.upstream.throw(e);
		return {value: value as any, done};
	}

	private upstreamIterator<PrevOut>(input: InputStreamRun<In, PrevOut, This>): AsyncIterable<PrevOut> {
		const self = this;
		const iterator = {
			async next(value?: any) {
				self.pressure.resolve();
				return await input.next(value);
			}
		};

		return {
			[Symbol.asyncIterator]: () => iterator
		}
	}

	private async* iterate(context: This, upstream: InputStreamRun<In, PrevOut, This>,
												 fn: IntoFn<PrevOut, Out, This>): AsyncIterator<Out> {
		for await (const out of fn.bind(context)(this.upstreamIterator(upstream))) yield out;
	}
}


export class IntoInputStream<In, PrevOut, NextOut, This = any> extends InputStream<In, NextOut, This> {

	constructor(private upstream: InputStream<In, PrevOut, This>, private fn: IntoFn<PrevOut, NextOut, This>) {
		super();
	}

	run(context: This): InputStreamRun<In, NextOut, This> {
		return new IntoInputStreamRun(context, this.upstream.run(context), this.fn);
	}
}