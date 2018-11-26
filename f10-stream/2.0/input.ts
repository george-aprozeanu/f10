import { FnValue, FnErr } from "./stream";
import { WritableStream } from "./writable";

export class InputStream<T> extends WritableStream<T> {

    close() {
        this.in(undefined as any, true);
    }

    in(value: T, done = false) {
        this.next({ value, done });
    }

    err(err?: any) {
        this.throw(err);
    }
}