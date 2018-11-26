import { Stream } from "./stream";
import { FnValue, FnErr, Dest } from "./dest";

export class InputStream<T> extends Stream<T> {

    protected dest = new Dest<T>();

    out(value?: FnValue<T>, err?: FnErr) {
        this.dest.fill(value, err);
    }

    close() {
        this.in(undefined as any, true);
    }

    in(value: T, done = false) {
        if (this.dest.canSend) this.dest.next({ value, done });
    }

    err(err?: any) {
        if (this.dest.canSend) this.dest.throw(err);
    }
}