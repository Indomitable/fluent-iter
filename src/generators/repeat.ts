/**
 * Returns generator which repeats value N times
 */
export default function* repeatGenerator<T>(value: T, times: number): Generator<T> {
    for (let i = 0; i < times; i++) {
        yield value;
    }
}

// export default class RepeatIterable<T> implements InternalIterable<T> {
//     readonly #value: T;
//     readonly #times: number;
//     constructor(value: T, times: number) {
//         this.#value = value;
//         this.#times = times;
//     }
//
//     [Symbol.iterator]() {
//         let indx = 0;
//         const max = this.#times;
//         const item = this.#value;
//         return {
//             next() {
//                 if (indx < max) {
//                     indx++;
//                     return iteratorResultCreator(item);
//                 } else {
//                     return doneValue();
//                 }
//             }
//         };
//     }
//
//     get() {
//         return this;
//     }
// }
