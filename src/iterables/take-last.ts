/**
 * Take last N elements
 */
export function takeLastIterator<TValue>(input: Iterable<TValue>, count: number): Iterable<TValue> {
    return {
        [Symbol.iterator]: function* () {
            const keep: TValue[] = [];
            for (const item of input) {
                keep.push(item);
                if (keep.length > count) {
                    keep.shift();
                }
            }
            yield* keep;
        }
    }
}

export function takeLastAsyncIterator<TValue>(input: AsyncIterable<TValue>, count: number): AsyncIterable<TValue> {
    return {
        [Symbol.asyncIterator]: async function* () {
            const keep: TValue[] = [];
            for await (const item of input) {
                keep.push(item);
                if (keep.length > count) {
                    keep.shift();
                }
            }
            yield* keep;
        }
    }
}
