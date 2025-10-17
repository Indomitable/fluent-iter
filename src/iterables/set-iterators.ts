//An Iterable that contains the elements from both input sequences, excluding duplicates.
export function unionIterator<TValue>(first: Iterable<TValue>, second: Iterable<TValue>): Iterable<TValue> {
    return new Set(first).union(new Set(second));
}
export function intersectIterator<TValue>(first: Iterable<TValue>, second: Iterable<TValue>): Iterable<TValue> {
    return new Set(first).intersection(new Set(second));
}

export function diffIterator<TValue>(first: Iterable<TValue>, second: Iterable<TValue>): Iterable<TValue> {
    return new Set(first).difference(new Set(second));
}
