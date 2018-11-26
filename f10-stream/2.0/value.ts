import { FnErr, FnValue } from "./stream";
import { InputStream } from "./input";

export class ValueStream<T> extends InputStream<T> {

    private result?: IteratorResult<T>;
    private thrown = false;
    private val_err?: any;

    out(value?: FnValue<T>, err?: FnErr) {
        super.out(value, err);
        this.send();
    }

    private send() {
        if (this.result) {
            const result = this.result;
            delete this.result;
            this.next(result);
        } else if (this.thrown) {
            const err = this.val_err;
            delete this.val_err;
            this.thrown = false;
            this.throw(err);
        }
    }

    next(result: IteratorResult<T>) {
        if (!this.fnValue) this.result = result;
        else super.next(result);
    }

    throw(err?: any) {
        if (!this.fnValue) {
            this.val_err = err;
            this.thrown = true;
        } else {
            super.throw(err);
        }
    }
}