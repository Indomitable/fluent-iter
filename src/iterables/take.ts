/**
 * Return first N numbers of source
 */
export function takeIterator<TValue>(input: Iterable<TValue>, count: number): Iterable<TValue> {
    return {
        [Symbol.iterator]: function* () {
            let fetched = 0;
            for (const item of input) {
                if (fetched < count) {
                    yield item;
                    fetched++;
                } else {
                    break;
                }
            }
        }
    }
}

export default function takeIteratorAsync<TValue>(input: AsyncIterable<TValue>, count: number): AsyncIterable<TValue> {
    return {
        [Symbol.asyncIterator]: async function* () {
            let fetched = 0;
            for await (const item of input) {
                if (fetched < count) {
                    yield item;
                    fetched++;
                } else {
                    break;
                }
            }
        }
    }
}
