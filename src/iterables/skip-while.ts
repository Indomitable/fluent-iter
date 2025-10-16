import type {InternalIterable} from "../interfaces.ts";
import {IterableGenerator} from "../utils.ts";

/**
 * Return skip first elements until condition got falsy and return rest
 */
export default function skipWhileIterator<TValue>(input: InternalIterable<TValue>, condition: (item: TValue, index: number) => boolean): Iterable<TValue> {
    return new IterableGenerator(() => skipWhileGenerator(input, condition));
}

function* skipWhileGenerator<TValue>(input: InternalIterable<TValue>, condition: (item: TValue, index: number) => boolean): Generator<TValue> {
    let flag = false;
    let index = 0;
    for (const item of input) {
        if (condition(item, index++) && !flag) {
            continue;
        } else {
            flag = true;
        }
        yield item;
    }
}

// import { BaseLinqIterable } from "../base-linq-iterable";
// import { doneValue, iteratorResultCreator } from "../utils";
//
// export class SkipWhileIterable extends BaseLinqIterable {
//     /**
//      *
//      * @param {Iterable} source
//      * @param {number} condition
//      */
//     constructor(source, condition) {
//         super(source);
//         this.condition = condition;
//     }
//
//     [Symbol.iterator]() {
//         const iterator = this._getSourceIterator();
//         const condition = this.condition;
//         let isFirstElementReached = false;
//         let index = -1;
//         return {
//             next() {
//                 const { done, value } = iterator.next();
//                 index++;
//                 if (done) {
//                     return doneValue();
//                 }
//                 if (isFirstElementReached) {
//                     return iteratorResultCreator(value);
//                 } else {
//                     let next = { done: false, value: value };
//                     while (!next.done && condition(next.value, index)) {
//                         next = iterator.next();
//                         index++;
//                     }
//                     if (next.done) {
//                         return doneValue();
//                     } else {
//                         isFirstElementReached = true;
//                         return iteratorResultCreator(next.value);
//                     }
//                 }
//             }
//         };
//     }
// }
