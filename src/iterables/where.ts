import type {Predicate} from "../interfaces.ts";

/**
 * Return filtered array [1, 2, 3, 4].where(x => x % 2 === 0) === [2, 4]
 */
export default function whereIterator<TValue>(input: Iterable<TValue>, predicate: Predicate<TValue>): Iterable<TValue> {
    return {
        [Symbol.iterator]: function* () {
            for (const item of input) {
                if (predicate(item)) {
                    yield item;
                }
            }
        }
    }
}
