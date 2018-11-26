import { Stream, FnValue, FnErr } from "./stream";

export class WritableStream<T> extends Stream<T> {

    protected fnValue?: FnValue<T>;
    protected fnErr?: FnErr;

    out(fnValue?: FnValue<T>, fnErr?: FnErr) {
        this.fnValue = fnValue;
        this.fnErr = fnErr;
    }

    protected next(result: IteratorResult<T>) {
        if (!this.fnValue) return
        const fnValue = this.fnValue;
        delete this.fnValue;
        delete this.fnErr;
        fnValue(result);
    }

    protected throw(err?: any) {
        const fnErr = this.fnErr;
        if (!this.fnValue || !fnErr) return;
        delete this.fnValue;
        delete this.fnErr;
        fnErr(err);
    }
}