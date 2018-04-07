const map = new Map();
map.set('one', 1);
map.set('two', 2);
map.set('three', 3);



const d: Map<string, string> = new Map(Array.from(map.entries()).map(([key, value]) => [key, value.toString()] as [string, string]));

console.log(d);
