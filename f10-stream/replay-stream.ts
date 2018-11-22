import {ExecutableStream} from "./executable-stream";

export class ReplayStream<Out> extends ExecutableStream<Out> {

	private offer: Promise<IteratorResult<Out>>;
	private offer_seq: number;

	constructor(private input: AsyncIterator<Out>) {
		super();
		this.offer = input.next();
		this.offer_seq = 0;
	}

	onDemand(seq: number) {
		const value = this.offer;
		if (seq > this.offer_seq) throw new Error('replay:next:!resolve');
		if (seq == this.offer_seq) {
			this.offer_seq++;
			this.offer = this.input.next();
		}
		return value;
	}

	main(): AsyncIterator<Out> {
		let seq = 0;
		return {next: () => this.onDemand(seq++)};
	}
}