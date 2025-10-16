/**
 * Return skip last N elements from sequence
 */
import {doneValue, getIterator, iteratorResultCreator} from "../utils.ts";

export default function skipLastIterator<TValue>(input: Iterable<TValue>, count: number): Iterable<TValue> {
    return new SkipLastIterable(input, count);
}

export class SkipLastIterable<TValue> implements Iterable<TValue> {
    readonly #source: Iterable<TValue>;
    readonly #count: number;
    /**
     *
     * @param {Iterable} source
     * @param {number} count
     */
    constructor(source: Iterable<TValue>, count: number) {
        this.#source = source;
        this.#count = count <= 0 ? 0 : count;
    }

    [Symbol.iterator]() {
        const iterator = getIterator(this.#source);
        const count = this.#count;
        const keep: TValue[] = [];
        let next: IteratorResult<TValue, undefined> = iteratorResultCreator(void 0 as TValue);
        return {
            next() {
                while (!next.done && keep.length <= count) {
                    next = iterator.next();
                    if (!next.done) {
                        keep.push(next.value);
                    }
                }
                if (next.done) {
                    return doneValue();
                }
                return iteratorResultCreator(keep.shift() as TValue);
            }
        };
    }
}
