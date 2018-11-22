import {Stream} from "./stream";

export abstract class ExecutableStream<Out> extends Stream<Out> {

	abstract main(): AsyncIterator<Out>;

	[Symbol.asyncIterator](): AsyncIterator<Out> {
		return this.main();
	}
}

