import { Component } from "react";

export interface LifecycleAttachment {
    mount(component: Component): void;

    unmount(component: Component): void;
}

function lifecycleAttach(componentPrototype: Component<any, any>, attachment: LifecycleAttachment) {
    const mount = componentPrototype.componentWillMount;
    const unmount = componentPrototype.componentWillUnmount;
    componentPrototype.componentWillMount = function () {
        if (mount) mount.apply(this);
        attachment.mount(this);
    };
    componentPrototype.componentWillUnmount = function () {
        if (unmount) unmount.apply(this);
        attachment.unmount(this);
    };
}

function stateMutation<T, S extends T>(componentPrototype: Component<any, S>, iterableFn: () => AsyncIterable<T>) {
    let mounted = true;

    async function execute(component: Component) {
        const iterator = iterableFn.apply(component)[Symbol.asyncIterator]();
        let result: IteratorResult<any> | undefined = undefined;
        do {
            if (mounted) {
                result = await iterator.next();
                if (mounted && result && !result.done) component.setState(result.value);
            }
        } while (mounted && result && !result.done);
    }

    lifecycleAttach(componentPrototype, {
        mount(component: Component) {
            execute(component).catch(console.error);
        },
        unmount() {
            mounted = false;
        }
    });
}

export const Mutation = <M>(iterable: AsyncIterable<M>) =>
    <S extends M>(target: { new(...args: any[]): Component<any, S> }) => {
        if (typeof target === 'function') stateMutation(target.prototype, () => iterable);
        else console.error(`@Mutation of ${target} was not installed`);
    };

export const mutation = <M, S extends M>(target: Component<any, S>, key?: string | symbol) => {
    if (key !== undefined) {
        const iterable = (target as any)[key];
        if (typeof iterable === 'function') {
            stateMutation(target, iterable);
        } else console.error(`@mutation of ${target.constructor.name}:${key} is not a Function`);
    } else console.error(`@mutation of ${target.constructor.name}:${key} was not installed`);
};
