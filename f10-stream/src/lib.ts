export function* rangeTo(from: number, to: number): Iterable<number> {
	let i = from;
	while (i < to) yield i++;
}

export function* rangeUntil(from: number, until: number): Iterable<number> {
	let i = from;
	while (i <= until) yield i++;
}

export function* mapIterable<In, Out>(iterable: Iterable<In>, fn: (value: In) => Out): Iterable<Out> {
	for (const value of iterable) yield fn(value);
}