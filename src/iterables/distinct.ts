import {doneValue, getIterator, iteratorResultCreator} from "../utils.ts";
import type {Equality} from "../interfaces.ts";

export default function distinctIterator<TValue>(source: Iterable<TValue>, comparer?: Equality<TValue>): Iterable<TValue> {
    return new DistinctIterable(source, comparer);
}

/**
 * Returns distinct values
 */
export class DistinctIterable<TValue> implements Iterable<TValue> {
    readonly #source: Iterable<TValue>;
    readonly #comparer: Equality<TValue> | undefined;

    /**
     *
     * @param {Iterable} source
     * @param {Function} comparer comparer function. if not provider use native Set.
     */
    constructor(source: Iterable<TValue>, comparer?: Equality<TValue>) {
        this.#source = source;
        this.#comparer = comparer;
    }

    [Symbol.iterator]() {
        if (!this.#comparer) {
            const set = new Set(this.#source);
            return getIterator(set);
        }
        const iterator = getIterator(this.#source);
        const itemChecker = new DistinctItemChecker(this.#comparer);
        return {
            next() {
                while (true) {
                    const { done, value } = iterator.next();
                    if (done) {
                        itemChecker.clear();
                        return doneValue();
                    }
                    if (itemChecker.has(value)) {
                        continue;
                    }
                    itemChecker.add(value);
                    return iteratorResultCreator(value);
                }
            }
        };
    }
}

class DistinctItemChecker<TValue> {
    readonly #comparer: Equality<TValue>;
    readonly #list: TValue[];
    constructor(comparer: Equality<TValue>) {
        this.#comparer = comparer;
        this.#list = [];
    }

    add(item: TValue) {
        this.#list.push(item);
    }

    has(item: TValue) {
        return this.#list.some(_ => this.#comparer(_, item));
    }

    clear() {
        this.#list.length = 0;
    }
}
