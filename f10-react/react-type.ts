export interface Main<T> {
    main: () => AsyncIterable<T>;
}
