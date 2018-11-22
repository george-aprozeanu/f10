import {Stream} from "./stream";
import {SeqConfig, SeqStream} from "./seq-stream";
import {PromiseWrap} from "./promise";

export class SharedStream<Out> extends SeqStream<Out, PromiseWrap<Out>> {
	constructor(private stream: AsyncIterator<Out>, config: SeqConfig) {
		super(config);
	}

	protected demand() {
		return {promise: this.stream.next()};
	}
}

export function sharedStream<Out>(stream: AsyncIterator<Out>, config: SeqConfig = {}) {
	return new SharedStream<Out>(stream, config);
}

declare module './stream' {
	export interface Stream<Out> {
		share(config?: SeqConfig): SharedStream<Out>;
	}
}

Stream.prototype.share = function <Out>(config: SeqConfig = {}) {
	return new SharedStream<Out>(this[Symbol.asyncIterator](), config);
};