import { Dest } from "./dest";

export enum ResultState {
    None, Value, Err
}

export class Result<T> {

    private result?: IteratorResult<T>;
    private err?: any;
    private _state: ResultState = ResultState.None;

    get canSend() {
        return this._state !== ResultState.None;
    }

    setValue(value: T, done = false) {
        this.set({ value, done });
    }

    set(result: IteratorResult<T>) {
        this.result = result;
        this._state = ResultState.Value;
    }

    setErr(err?: any) {
        this.err = err;
        this._state = ResultState.Err;
    }

    send(dest: Dest<T>) {
        if (!this.result) throw new Error("result:send:!result");
        const state = this._state;
        const result = this.result;
        const err = this.err;
        delete this.result;
        delete this.err;
        this._state = ResultState.None;
        switch (state) {
            case ResultState.Value:
                dest.next(result);
                return;
            case ResultState.Err:
                dest.throw(err);
                return;
        }
    }
}