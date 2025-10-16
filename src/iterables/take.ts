import {IterableGenerator} from "../utils.ts";

/**
 * Return first N numbers of source
 */
export default function takeIterator<TValue>(input: Iterable<TValue>, count: number): Iterable<TValue> {
    // const inner = input.getInner();
    // if (Array.isArray(inner)) {
    //     return inner.slice(0, count);
    // }
    return new IterableGenerator(() => takeGenerator(input, count));
    //return new TakeIterable(input, count);
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

// export class TakeIterable<TValue> implements Iterable<TValue> {
//     readonly #source: Iterable<TValue>;
//     readonly #count: number;
//     /**
//      *
//      * @param {Iterable} source
//      * @param {number} count
//      */
//     constructor(source: Iterable<TValue>, count: number) {
//         this.#source = source;
//         this.#count = count <= 0 ? 0 : count;
//     }
//
//     [Symbol.iterator]() {
//         const iterator = getIterator(this.#source);
//         const count = this.#count;
//         let fetched = 0;
//         return {
//             next() {
//                 if (fetched < count) {
//                     const { done, value } = iterator.next();
//                     fetched++;
//                     if (done) {
//                         return doneValue();
//                     }
//                     return iteratorResultCreator(value);
//                 }
//                 return doneValue();
//             }
//         };
//     }
// }
