import { NextFn, ErrFn, Stream } from './stream';

export class ReplayStream<T> extends Stream<T> {

    private _result?: IteratorResult<T>;
    private _err?: any;
    private _has_result = false;
    private _has_err = false;

    private _d_next?: NextFn<T>;
    private _d_err?: ErrFn;

    private _u_next(result: IteratorResult<T>) {
        if (this._d_next) {
            this._d_next(result);
            this._reset();
        } else {
            this._has_result = true;
            this._result = result;
        }
        this._loop();
    }

    private _u_err(err?: any) {
        if (this._d_err) {
            this._d_err(err);
            this._reset();
        } else {
            this._has_err = true;
            this._err = err;
        }
        this._loop();
    }

    private _reset() {
        delete this._d_next;
        delete this._d_err;
        delete this._result;
        delete this._err;
        this._has_err = false;
        this._has_result = false;
    }

    private _loop() {
        this._upstream.out(this._u_next, this._u_err);
    }

    constructor(private _upstream: Stream<T>) {
        super();
        this._loop();
    }

    out(next: NextFn<T>, err?: ErrFn) {
        if (this._has_result) {
            next(this._result!);
            this._reset();
        } else if (this._has_err) {
            err && err(this._err);
            this._reset();
        } else {
            this._d_next = next;
            this._d_err = err;
        }
    }
}

declare module './stream' {
    export interface Stream<T> {
        replay: () => ReplayStream<T>;
    }
}

Stream.prototype.replay = function<S extends Stream<T>, T>(this: S) {
    return new ReplayStream(this);
}