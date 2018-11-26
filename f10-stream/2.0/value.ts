import { Stream } from "./stream";
import { FnErr, FnValue, Dest } from "./dest";
import { Result } from "./result";
import { InputStream } from "./input";

export class ValueStream<T> extends InputStream<T> {

    private from = new Result<T>();

    out(value?: FnValue<T>, err?: FnErr) {
        super.out(value, err);
        if (this.from.canSend && this.dest.canSend) this.from.send(this.dest);
    }

    in(value: T, done = false) {
        this.from.setValue(value, done);
        if (this.dest.canSend) this.from.send(this.dest);
    }

    err(err?: any) {
        this.from.setErr(err);
        if (this.dest.canSend) this.from.send(this.dest);
    }
}