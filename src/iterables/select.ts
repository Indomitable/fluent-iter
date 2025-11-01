import type {Mapper} from "../interfaces.ts";
import {createIterable} from "../utils.ts";

/**
 * Return mapped array [1, 2, 3].select(x => x * 2) === [2, 4, 6]
 */
export function selectIterator<TValue, TOutput>(input: Iterable<TValue>, map: Mapper<TValue, TOutput>): Iterable<TOutput> {
    return createIterable(() => selectGenerator(input, map));
}

function* selectGenerator<TValue, TOutput>(input: Iterable<TValue>, map: Mapper<TValue, TOutput>): Generator<TOutput> {
    for (const item of input) {
        yield map(item);
    }
}

export function selectAsyncIterator<TValue, TOutput>(input: AsyncIterable<TValue>, map: Mapper<TValue, TOutput>): AsyncIterable<TOutput> {
    return {
        [Symbol.asyncIterator]: async function* () {
            for await (const item of input) {
                yield map(item);
            }
        }
    }
}

