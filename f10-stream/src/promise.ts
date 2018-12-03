export type Resolve<Out> = (value?: Out | PromiseLike<Out>) => void;
export type Reject = (reason?: any) => void;

export interface Deffer<T> extends PromiseLike<T> {
	resolve: Resolve<T>;
	reject: Reject;
	promise: Promise<T>;
}

export function deffer<T = void>(): Deffer<T> {
	let resolve: Resolve<T>;
	let reject: Reject;
	const promise = new Promise<T>((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});
	return {promise, resolve: resolve!, reject: reject!, then: promise.then.bind(promise) as any};
}


export interface PromiseWrap<T> {
	promise: Promise<IteratorResult<T>>;
}

export interface DefferWrap<T> extends PromiseWrap<T> {
	resolve?: Resolve<IteratorResult<T>>;
	reject?: Reject;
}

export class DefferWrapImpl<T> implements DefferWrap<T> {
	promise: Promise<IteratorResult<T>> = undefined as any;
	resolve: Resolve<IteratorResult<T>> = undefined as any;
	reject: Reject = undefined as any;

	constructor() {
		this.promise = new Promise<IteratorResult<T>>((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		})
	}
}
