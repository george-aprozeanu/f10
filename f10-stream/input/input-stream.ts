export interface InputStreamCall<In, This> {
	(this: This, value: In): Promise<void>
}

export interface CallableInputStream<In, Out, This> extends InputStreamCall<In, This>, AsyncIterator<Out> {
}

export interface InputStreamRun<In, Out, This> extends AsyncIterator<Out> {
	call(context: This): InputStreamCall<In, This>;

	next(value?: any): Promise<IteratorResult<Out>>;

	throw(e?: any): Promise<IteratorResult<Out>>;

	return(value?: any): Promise<IteratorResult<Out>>;
}

export abstract class InputStream<In, Out, This> {

	abstract run(context: This): InputStreamRun<In, Out, This>;

	bind(context: This): CallableInputStream<In, Out, This> {
		const run = this.run(context);
		const fn = run.call(context).bind(context);
		return Object.assign(fn, {
			next: run.next.bind(run),
			throw: run.throw.bind(run),
			return: run.return.bind(run)
		});
	}
}

