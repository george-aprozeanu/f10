import { Stream, NextFn, ErrFn } from "./stream";

export class InputStream<T> extends Stream<T> {

    private _next?: NextFn<T>;
    private _err?: ErrFn;
    private _result: IteratorResult<T> = {} as IteratorResult<T>;

    out(next: NextFn<T>, err?: ErrFn) {
        this._next = next;
        this._err = err;
    }

    in(value: T, done = false) {
        if (this._next) {
            this._result.value = value;
            this._result.done = done;
            this._next(this._result);
            delete this._next;
            delete this._err;
        }
    }

    err(err?: any) {
        if (this._err) {
            this._err(err);
            delete this._next;
            delete this._err;
        }
    }
}