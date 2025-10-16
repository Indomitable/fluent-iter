import type {InternalIterable} from "../interfaces.ts";
import {IterableGenerator} from "../utils.js";

/**
 * Skip first N numbers of source and return the rest
 */
export default function skipIterator<TValue>(input: InternalIterable<TValue>, count: number): Iterable<TValue> {
    const inner = input.getInner();
    if (Array.isArray(inner)) {
        return inner.slice(count, inner.length);
    }
    return new IterableGenerator(() => skipGenerator(input, count));
}

function* skipGenerator<TValue>(input: InternalIterable<TValue>, count: number): Generator<TValue> {
    let skipped = 0;
    for (const item of input) {
        if (skipped < count) {
            skipped++;
            continue;
        }
        yield item;
    }
}

// export class SkipIterable extends NativeProcessingLinqIterable {
//     /**
//      *
//      * @param {Iterable} source
//      * @param {number} count
//      */
//     constructor(source, count) {
//         super(source);
//         this.count = count <= 0 ? 0 : count;
//     }
//
//     _nativeTake(array) {
//         return array.slice(this.count, array.length);
//     }
//
//     [Symbol.iterator]() {
//         const { processed, source } = this._tryNativeProcess();
//         if (processed) {
//             return this._getIterator(processed);
//         }
//         const iterator = this._getIterator(source);
//         const count = this.count;
//         let skipped = 0;
//         return {
//             next() {
//                 if (skipped === 0) {
//                     // first get.
//                     while (skipped < count) {
//                         const { done } = iterator.next();
//                         skipped++;
//                         if (done) {
//                             return { done: true };
//                         }
//                     }
//                 }
//                 return iterator.next();
//             }
//         };
//     }
// }
