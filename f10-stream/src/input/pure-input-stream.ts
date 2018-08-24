import {deffer, Deffer} from "../promise";
import {InputStream, InputStreamCall, InputStreamRun} from "./input-stream";

class PureInputStreamRun<In, This> implements InputStreamRun<In, In, This> {

	offer?: Promise<IteratorResult<In>>;
	demand?: Deffer<IteratorResult<In>>;

	call(context: This) {
		const self = this;
		return async function (this: This, value: In) {
			await self.onOffer({value, done: false});
		}
	};

	private async onOffer(result: IteratorResult<In>) {
		if (this.demand === undefined) {
			this.offer = Promise.resolve(result);
			await this.offer;
		} else {
			const deffer = this.demand;
			this.demand = undefined;
			deffer.resolve(result);
			await deffer;
		}
	}

	private async onError(err?: any) {
		if (this.demand === undefined) {
			this.offer = Promise.reject(err);
			await this.offer;
		} else {
			const deffer = this.demand;
			this.demand = undefined;
			deffer.reject(err);
			await deffer;
		}
	}

	async return(value?: any): Promise<IteratorResult<In>> {
		const result: IteratorResult<In> = {value: undefined as any, done: true};
		await this.onOffer(result);
		return result;
	}

	async throw(err?: any): Promise<IteratorResult<In>> {
		await this.onError(err);
		return {value: undefined as any, done: true};
	}

	next(): Promise<IteratorResult<In>> {
		if (this.offer !== undefined) {
			const value = this.offer;
			this.offer = undefined;
			return value;
		} else {
			if (this.demand !== undefined) throw new Error('input:next:!resolve');
			this.demand = deffer();
			return this.demand.promise;
		}
	}
}

export class PureInputStream<In, This = any> extends InputStream<In, In, This> {

	constructor() {
		super();
	}

	run(context: This): InputStreamRun<In, In, This> {
		return new PureInputStreamRun();
	}
}

export function input<In, This = any>(): InputStream<In, In, This> {
	return new PureInputStream<In>();
}