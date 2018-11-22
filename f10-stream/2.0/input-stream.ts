import { Stream } from "../stream";
import { Deffer, deffer } from "../promise";

export class InputStream<T> extends Stream<T> {

    private _iterated = false;

    /**
     * Throws if called more than once. This is used when creating a new
     * iterator instance for this stream. If multiple iterator instances would
     * be allowed only the _last_ instance would be receiving values, as it
     * is essential to keep a reference of the *_value* field within the
     * iterator to get updates. This would be fine if the previous iterator 
     * would be known to be useless, but we have no guarantee for that so,
     * to avoid serious bugs, we make the code safe with this throw.
     */
    private assertOneConsumer() {
        if (this._iterated) throw new Error("stream:input:2x:iterate!");
        this._iterated = true;
    }

    private next = () => (this._value = deffer()).promise;

    private _value?: Deffer<IteratorResult<T>>;
    private _result: IteratorResult<T> = {value: undefined as any, done: false};

    /**
     * The *_result* object is reused to send over new *value* instances.
     */
    private result(value: T) {
        this._result.value = value;
        return this._result;
    }

    [Symbol.asyncIterator](): AsyncIterator<T> {
        this.assertOneConsumer();
        return { next: this.next };
    }

    input(value: T) {
        if (this._value) this._value.resolve(this.result(value));
    }
}