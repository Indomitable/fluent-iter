// import {InternalIterable} from "../interfaces.ts";
// import {doneValue, emptyIterator, iteratorResultCreator} from "../utils.ts";

/**
 * Generates range of numbers [from, to)
 */
export default function* rangeGenerator(from: number, to: number): Generator<number> {
    // return new RangeIterable(from, to);
    if (from < to) {
        for (let i = from; i < to; i++) {
            yield i;
        }
    } else {
        for (let i = from; i > to; i--) {
            yield i;
        }
    }
}

// class RangeIterable implements InternalIterable<number> {
//     readonly #from: number;
//     readonly #to: number;
//     /**
//      * The range is [from, to)
//      * @param {number} from
//      * @param {number} to
//      */
//     constructor(from: number, to: number) {
//         this.#from = from;
//         this.#to = to;
//     }
//
//     __ascendingRange(): Iterator<number> {
//         const to = this.#to;
//         let current = this.#from;
//         return {
//             next() {
//                 if (current < to) {
//                     return iteratorResultCreator(current++);
//                 } else {
//                     return doneValue();
//                 }
//             }
//         };
//     }
//
//     __descendingRange(): Iterator<number> {
//         const to = this.#to;
//         let current = this.#from;
//         return {
//             next() {
//                 if (current > to) {
//                     return iteratorResultCreator(current--);
//                 } else {
//                     return doneValue();
//                 }
//             }
//         };
//     }
//
//     [Symbol.iterator]() {
//         if (this.#from < this.#to) {
//             return this.__ascendingRange();
//         }
//         if (this.#from > this.#to) {
//             return this.__descendingRange();
//         }
//         return emptyIterator<number>();
//     }
//
//     getInner() {
//         return this;
//     }
// }
