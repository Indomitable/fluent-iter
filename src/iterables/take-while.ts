import {IterableGenerator} from "../utils.ts";

/**
 * Return items until certain condition got falsy
 */
export default function takeWhileIterator<TValue>(input: Iterable<TValue>, condition: (item: TValue, index: number) => boolean): Iterable<TValue> {
    return new IterableGenerator(() => takeWhileGenerator(input, condition));
}

function* takeWhileGenerator<TValue>(input: Iterable<TValue>, condition: (item: TValue, index: number) => boolean): Generator<TValue> {
    let index = 0;
    for (const item of input) {
        if (condition(item, index++)) {
            yield item;
        } else {
            break;
        }
    }
}

// export class TakeWhileIterable extends BaseLinqIterable {
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
//         let index = -1;
//         return {
//             next() {
//                 const { done, value } = iterator.next();
//                 index++;
//                 if (!done && condition(value, index)) {
//                     return iteratorResultCreator(value)
//                 } else {
//                     return doneValue()
//                 }
//             }
//         };
//     }
// }
