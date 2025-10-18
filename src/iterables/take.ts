import {createIterable} from "../utils.ts";

/**
 * Return first N numbers of source
 */
export default function takeIterator<TValue>(input: Iterable<TValue>, count: number): Iterable<TValue> {
    return createIterable(() => takeGenerator(input, count));
}

function* takeGenerator<TValue>(input: Iterable<TValue>, count: number): Generator<TValue> {
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
