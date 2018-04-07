
function * simple() {
    for (let value of [1,2,3]) {
        console.log('about to yield', value);
        yield value;
        console.log('finished yield', value);
    }
}

for (let value of simple()) {
    console.log('read', value);
}