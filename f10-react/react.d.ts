/// <reference types="react" />
import { Component } from "react";
export declare class F10React<T> {
    readonly component: Component;
    iterators: AsyncIterator<any>[];
    static init<V>(component: Component): F10React<V>;
    begin<T>(iterator: AsyncIterable<T>): Promise<void>;
    constructor(component: Component);
}
