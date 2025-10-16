import type {InternalIterable, Predicate} from "../interfaces.ts";
import {doneValue, getIterator, IterableGenerator, iteratorResultCreator} from "../utils.ts";

/**
 * Return filtered array [1, 2, 3, 4].where(x => x % 2 === 0) === [2, 4]
 */
export default function whereIterator<TValue>(input: InternalIterable<TValue>, predicate: Predicate<TValue>): Iterable<TValue> {
    const inner = input.getInner();
    if (Array.isArray(inner)) {
        return inner.filter(predicate);
    }
    return new IterableGenerator(() => whereGenerator(input, predicate));
}

function* whereGenerator<TValue>(input: InternalIterable<TValue>, predicate: Predicate<TValue>): Generator<TValue> {
    for (const item of input) {
        if (predicate(item)) {
            yield item;
        }
    }
}

/**
 * Return filtered array [1, 2, 3, 4].where(x => x % 2 === 0) === [2, 4]
 */
// class WhereIterable<TValue> {
//     readonly #source: Iterable<TValue>;
//     readonly #predicate: Predicate<TValue>;
//     /**
//      *
//      * @param {Iterable} source
//      * @param {Function} predicate
//      */
//     constructor(source: Iterable<TValue>, predicate: Predicate<TValue>) {
//         this.#source = source;
//         this.#predicate = predicate;
//     }
//
//     static __findNext<TValue>(iterator: Iterator<TValue>, predicate: Predicate<TValue>) {
//         let done = false;
//         while (!done) {
//             const next = iterator.next();
//             if (!next.done && predicate(next.value)) {
//                 return iteratorResultCreator(next.value);
//             }
//             done = next.done ?? false;
//         }
//         return doneValue();
//     }
//
//     [Symbol.iterator]() {
//         const iterator = getIterator(this.#source);
//         const predicate = this.#predicate;
//         return {
//             next() {
//                 return WhereIterable.__findNext(iterator, predicate);
//             }
//         };
//     }
// }
