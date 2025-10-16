import type {InternalIterable, Mapper} from "../interfaces.ts";
import {IterableGenerator} from "../utils.ts";

/**
 * Return mapped array [1, 2, 3].select(x => x * 2) === [2, 4, 6]
 */
export default function selectIterator<TValue, TOutput>(input: InternalIterable<TValue>, map: Mapper<TValue, TOutput>): Iterable<TOutput> {
    const inner = input.getInner();
    if (Array.isArray(inner)) {
        return inner.map(map);
    }
    return new IterableGenerator(() => selectGenerator(input, map));
}

function* selectGenerator<TValue, TOutput>(input: InternalIterable<TValue>, map: Mapper<TValue, TOutput>): Generator<TOutput> {
    for (const item of input) {
        yield map(item);
    }
}

/**
 * Return mapped array [1, 2, 3].select(x => x * 2) === [2, 4, 6]
 */
// export class SelectIterable<TValue, TResult> implements Iterable<TResult> {
//     readonly #source: Iterable<TValue>;
//     readonly #map: Mapper<TValue, TResult>;
//     /**
//      *
//      * @param {Iterable} source
//      * @param {Function} map
//      */
//     constructor(source: Iterable<TValue>, map: Mapper<TValue, TResult>) {
//         this.#source = source;
//         this.#map = map;
//     }
//
//     [Symbol.iterator]() {
//         const iterator = getIterator(this.#source);
//         const map = this.#map;
//         return {
//             next() {
//                 const { done, value } = iterator.next();
//                 if (done) {
//                     return doneValue();
//                 }
//                 return iteratorResultCreator(map(value));
//             }
//         };
//     }
// }