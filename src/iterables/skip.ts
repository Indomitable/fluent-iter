import {createIterable} from "../utils.ts";

/**
 * Skip first N numbers of source and return the rest
 */
export function skipIterator<TValue>(input: Iterable<TValue>, count: number): Iterable<TValue> {
    return createIterable(() => skipGenerator(input, count));
}

function* skipGenerator<TValue>(input: Iterable<TValue>, count: number): Generator<TValue> {
    let skipped = 0;
    for (const item of input) {
        if (skipped < count) {
            skipped++;
            continue;
        }
        yield item;
    }
}

export function skipIteratorAsync<TValue>(input: AsyncIterable<TValue>, count: number): AsyncIterable<TValue> {
    return {
        [Symbol.asyncIterator]: async function* (){
            let skipped = 0;
            for await (const item of input) {
                if (skipped < count) {
                    skipped++;
                    continue;
                }
                yield item;
            }
        }
    }
}
