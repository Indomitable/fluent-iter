/**
 * Return skip last N elements from sequence
 */
export function skipLastIterator<TValue>(input: Iterable<TValue>, count: number): Iterable<TValue> {
    return {
        [Symbol.iterator]: function* () {
            const keep: TValue[] = [];
            for (const item of input) {
                keep.push(item);
                if (keep.length > count) {
                    yield keep.shift() as TValue;
                }
            }
        }
    }
}

export function skipLastAsyncIterator<TValue>(input: AsyncIterable<TValue>, count: number): AsyncIterable<TValue> {
    return {
        [Symbol.asyncIterator]: async function* () {
            const keep: TValue[] = [];
            for await (const item of input) {
                keep.push(item);
                if (keep.length > count) {
                    yield keep.shift() as TValue;
                }
            }
        }
    }
}
