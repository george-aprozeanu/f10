var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
if (!Symbol.asyncIterator)
    Symbol.asyncIterator = Symbol.for("Symbol.asyncIterator");
export class Stream {
}
export class ExecutableStream extends Stream {
    [Symbol.asyncIterator]() {
        return this.main();
    }
}
export class IterableStream extends ExecutableStream {
    constructor(fn) {
        super();
        this.fn = fn;
    }
    [Symbol.asyncIterator]() {
        return this.main();
    }
    main() {
        return __asyncGenerator(this, arguments, function* main_1() {
            yield __await(yield* __asyncDelegator(__asyncValues(this.fn())));
        });
    }
}
export function stream(iterable) {
    return new IterableStream(typeof iterable === "function" ? iterable : () => iterable);
}
export class Seq {
    constructor(wrap, next) {
        this.wrap = wrap;
        this.next = next;
    }
}
export class SeqStream extends Stream {
    /**
     * @param {number} size How many values to keep in the buffer.
     *   -1 : keep all values;
     *    0 : keep no values; reading from the stream always blocks;
     *  >=1 : keep that many values; reading from the stream will start with that many values replayed, but no more
     *        than set by the _replay_ param.
     *
     * @param {number} replay How many values to replay upon starting a new read.
     *   -1 : Replay all values. The backlog will be limited only by the buffer size;
     *    0 : Do not replay. Only new values will be delivered. Insures the read will surely block on the first read.
     *  > 0 : Replay that many values. Entering 1 will ensure the first delivery is the last emitted value.
     */
    constructor(size = -1, replay = -1) {
        super();
        this.size = size;
        this.replay = replay;
        this.seq = 0;
        this.first = 0;
        this.buffer = [];
    }
    [Symbol.asyncIterator]() {
        let seq = this.replay > -1 ? this.seq - this.replay : 0;
        return {
            next: () => {
                if (seq > this.seq)
                    throw new Error("read:seq!>");
                const value = this.getSeq(seq);
                seq = value.next;
                return value.wrap.promise;
            }
        };
    }
    getSeq(seq) {
        seq = this.correctSeq(seq);
        let index = seq - this.first;
        if (!this.buffer[index])
            this.nextSeq(seq, index);
        const ret = this.buffer[index];
        this.trim();
        return ret;
    }
    trim() {
        const maxSize = this.size + 1;
        if (maxSize > 0 && this.buffer.length > maxSize) {
            const cut = this.buffer.length - maxSize;
            this.buffer.splice(0, cut);
            this.first += cut;
        }
    }
    correctSeq(seq) {
        if (seq > this.seq + 1)
            throw new Error("write:seq+>1");
        const oldestSeq = this.size > -1 ? Math.max(0, this.seq - this.size) : 0;
        seq = Math.max(seq, oldestSeq);
        if (this.last !== undefined)
            seq = Math.min(seq, this.last);
        return seq;
    }
    nextSeq(seq, index) {
        const demand = this.demand();
        const next = seq + 1;
        demand.promise = demand.promise.then(result => {
            if (result.done)
                this.last = seq;
            else
                this.seq = next;
            return result;
        });
        this.buffer[index] = new Seq(demand, next);
    }
}
export class WriteStream extends SeqStream {
    constructor(distinct = true, size = -1, replay = 1) {
        super(size, replay);
        this.distinct = distinct;
        this.prevSeq = -1;
    }
    done(returnValue) {
        return this.offer({ value: returnValue, done: true });
    }
    write(value) {
        return this.offer({ value, done: false });
    }
    update(fn) {
        return this.write(fn(this.prevValue));
    }
    get value() {
        return this.prevValue;
    }
    set value(value) {
        this.write(value);
    }
    demand() {
        let resolve;
        let reject;
        const wrap = {
            promise: new Promise((_resolve, _reject) => {
                resolve = _resolve;
                reject = _reject;
            })
        };
        wrap.resolve = resolve;
        wrap.reject = reject;
        return wrap;
    }
    offer(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.seq === this.prevSeq && this.seq !== this.last)
                throw new Error("write:!await");
            if (this.distinct) {
                if (this.prevValue !== undefined && !result.done && result.value === this.prevValue)
                    return;
            }
            this.prevValue = result.value;
            this.prevSeq = this.seq;
            if (this.last !== undefined) {
                if (result.done)
                    return;
                else
                    throw new Error("write:done");
            }
            const next = this.getSeq(this.seq);
            next.wrap.resolve(result);
            yield next.wrap.promise;
        });
    }
}
export function writeStream(distinct = true, size = -1, replay = 1) {
    return new WriteStream(distinct, size, replay);
}
export class SharedStream extends SeqStream {
    constructor(stream, size = -1, replay = 1) {
        super(size, replay);
        this.stream = stream;
    }
    demand() {
        return { promise: this.stream.next() };
    }
}
export function sharedStream(stream) {
    return new SharedStream(stream);
}
Stream.prototype.share = function (size = -1, replay = 1) {
    return new SharedStream(this[Symbol.asyncIterator](), size, replay);
};
//# sourceMappingURL=stream.js.map