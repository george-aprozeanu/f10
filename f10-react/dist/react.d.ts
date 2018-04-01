/// <reference types="react" />
import { Component } from "react";
export interface LifecycleAttachment {
    mount(component: Component): void;
    unmount(component: Component): void;
}
export declare const Mutation: <M>(iterable: AsyncIterable<M>) => <S extends M>(target: new (...args: any[]) => Component<any, S>) => void;
export declare const mutation: <M, S extends M>(target: Component<any, S>, key?: string | symbol | undefined) => void;
