export interface FnValue<T> {
    (result: IteratorResult<T>): void;
}

export interface FnErr {
    (err?: any): void;
}

export interface FnOut<T> {
    (value: FnValue<T>, err?: FnErr): void;
}

export enum DestState {
    Empty, Filled
}

export class Dest<T> {

    private state = DestState.Empty;
    private fnValue?: FnValue<T>;
    private fnErr?: FnErr;

    fill(valueFn?: FnValue<T>, errFn?: FnErr) {
        this.fnValue = valueFn;
        this.fnErr = errFn;
        this.state = valueFn ? DestState.Filled : DestState.Empty;
    }

    next(result: IteratorResult<T>) {
        if (!this.canSend) throw new Error('dest:next:!canSend');
        const fnValue = this.fnValue;
        this.clear();
        if (fnValue) fnValue(result);
    }

    throw(err?: any) {
        if (!this.canSend) throw new Error('dest:throw:!canSend');
        const fnErr = this.fnErr;
        this.clear();
        if (fnErr) fnErr(err);
    }

    get canSend() {
        return this.state === DestState.Filled;
    }

    private clear() {
        delete this.fnValue;
        delete this.fnErr;
        this.state = DestState.Empty;
    }
}