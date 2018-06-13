import {Component} from "react";

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

const F10 = Symbol.for('Symbol.F10');

function stateMutation<T, S extends T>(componentPrototype: Component<any, S>, iterableFn: () => AsyncIterable<T>) {

	async function execute(component: Component) {
		let state: { mounted: boolean };
		if ((component as any)[F10] === undefined) {
			state = {mounted: true};
			(component as any)[F10] = state;
		} else {
			state = (component as any)[F10];
		}
		const iterator = iterableFn.apply(component)[Symbol.asyncIterator]();
		let result: IteratorResult<any> | undefined = undefined;
		do {
			if (state.mounted) {
				result = await iterator.next();
				if (state.mounted && result && !result.done) component.setState(result.value);
			}
		} while (state.mounted && result && !result.done);
	}

	lifecycleAttach(componentPrototype, {
		mount(component: Component) {
			execute(component).catch(console.error);
		},
		unmount(component: Component) {
			(component as any)[F10].mounted = false;
		}
	});
}

export const Mutation = <M>(iterable: () => AsyncIterable<M>) =>
	<S extends M>(target: { new(...args: any[]): Component<any, S> }) => {
		if (typeof target === 'function') stateMutation(target.prototype, iterable);
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
