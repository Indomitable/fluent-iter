import type {Mapper} from "../interfaces.ts";
import {IterableGenerator} from "../utils.ts";

/**
 * Return mapped array [1, 2, 3].select(x => x * 2) === [2, 4, 6]
 */
export default function selectIterator<TValue, TOutput>(input: Iterable<TValue>, map: Mapper<TValue, TOutput>): Iterable<TOutput> {
    return new IterableGenerator(() => selectGenerator(input, map));
}

function* selectGenerator<TValue, TOutput>(input: Iterable<TValue>, map: Mapper<TValue, TOutput>): Generator<TOutput> {
    for (const item of input) {
        yield map(item);
    }
}
