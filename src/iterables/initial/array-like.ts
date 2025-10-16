import {InternalIterable} from "../../interfaces.ts";
import {doneValue, getIterator, iteratorResultCreator} from "../../utils.ts";

export default function arrayLikeIterator<T>(source: ArrayLike<T>): Iterable<T> {
    return new ArrayLikeIterable(source);
}

class ArrayLikeIterable<T> implements InternalIterable<T> {
    readonly #source: ArrayLike<T>;
    constructor(source: ArrayLike<T>) {
        this.#source = source;
    }

    getInner(): T[] | ArrayLikeIterable<T> {
        return Array.isArray(this.#source) ? this.#source : this;
    }

    [Symbol.iterator]() {
        if (Array.isArray(this.#source)) {
            return getIterator(this.#source);
        }
        const length = this.#source.length;
        const source = this.#source;
        let current = 0;
        return {
            next() {
                if (current < length) {
                    const value = source[current];
                    current++;
                    return iteratorResultCreator(value);
                } else {
                    return doneValue();
                }
            }
        };
    }
}
