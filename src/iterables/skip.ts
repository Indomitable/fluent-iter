import {IterableGenerator} from "../utils.ts";

/**
 * Skip first N numbers of source and return the rest
 */
export default function skipIterator<TValue>(input: Iterable<TValue>, count: number): Iterable<TValue> {
    return new IterableGenerator(() => skipGenerator(input, count));
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
