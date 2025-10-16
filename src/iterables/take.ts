import {IterableGenerator} from "../utils.ts";
import type {InternalIterable} from "../interfaces.ts";

/**
 * Return first N numbers of source
 */
export default function* takeIterator<TValue>(input: InternalIterable<TValue>, count: number): Iterable<TValue> {
    const inner = input.getInner();
    if (Array.isArray(inner)) {
        return inner.slice(0, count);
    }
    return new IterableGenerator(() => takeGenerator(input, count));
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

// export class TakeIterable extends NativeProcessingLinqIterable {
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
//         return array.slice(0, this.count);
//     }
//
//     [Symbol.iterator]() {
//         const { processed, source } = this._tryNativeProcess();
//         if (processed) {
//             return this._getIterator(processed);
//         }
//         const iterator = this._getIterator(source);
//         const count = this.count;
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
