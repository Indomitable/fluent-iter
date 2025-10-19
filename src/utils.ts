import {Comparer} from "./interfaces.ts";
import {from, fromIterable} from "./creation.js";
import { FluentIterable } from "fluent-iter";

/**
 * Helper function to be use to access Symbol.iterator of iterable
 * @param {Iterable} iterable
 * @return {Iterator} iterator.
 */
export function getIterator<T>(iterable: Iterable<T>): Iterator<T> {
    return iterable[Symbol.iterator]();
}

export function __search<T>(items: T[], value: T, start: number, end: number, comparer: Comparer<T>): number {
    if (start > end) {
        return -1;
    }
    const middle = Math.floor((start + end) / 2);
    const result = comparer(items[middle], value);
    if (result === 0) {
        return middle;
    }
    if (result < 0) {
        return __search(items, value, middle + 1, end, comparer);
    } else {
        return __search(items, value, start, middle - 1, comparer);
    }
}

/**
 * Do a binary search in ordered list
 * @param items list
 * @param value searched value
 * @param comparer comparer function
 * @return {number} index of the value we search.
 */
export function search<T>(items: T[], value: T, comparer: Comparer<T>): number {
    const start = 0;
    const end = items.length - 1;
    return __search(items, value, start, end, comparer);
}

export function __findInsertIndex<T>(
    items: T[],
    value: T,
    start: number,
    end: number,
    comparer: (a: T, b: T) => number,
): number {
    const middle = Math.floor((start + end) / 2);
    const result = comparer(items[middle], value);
    if (result === 0) {
        // found same value, insert after it.
        return middle + 1;
    }
    if (result < 0) {
        // middle is smaller than value, check next if is bigger then return index if not continue searching.
        if (middle + 1 === items.length) {
            // middle is last item.
            return items.length;
        }
        const nextResult = comparer(items[middle + 1], value);
        if (nextResult === 0) {
            // equal with next; // insert after that.
            return middle + 2;
        }
        if (nextResult < 0) {
            // next is still smaller
            return __findInsertIndex(items, value, middle + 2, end, comparer);
        } else {
            // next is bigger.
            return middle + 1;
        }
    } else {
        // middle is bigger than value;
        if (middle === 0) {
            // middle is first
            return 0;
        }
        const prevResult = comparer(items[middle - 1], value);
        if (prevResult === 0 || prevResult < 0) {
            // previous result is equal insert after that (before middle)
            return middle;
        } else {
            return __findInsertIndex(items, value, 0, middle - 2, comparer);
        }
    }
}

/**
 * Inserts an element into an ordered collection while keeping the order.
 * @param items collection
 * @param value value to insert
 * @param {Function} comparer comparer which to check the collections
 * @return {Array} the array with inserted value.
 */
export function insertOrdered<T>(items: T[], value: T, comparer: Comparer<T>): T[] {
    const start = 0;
    const end = items.length;
    if (start === end) {
        items.splice(0, 0, value);
        return items;
    }
    const insertIndex = __findInsertIndex(items, value, start, end, comparer);
    items.splice(insertIndex, 0, value);
    return items;
}

/**
 * A helper class which using Set to check for distinct elements.
 */
export class SetCheck<T> {
    #set: Set<T>;

    constructor() {
        this.#set = new Set<T>();
    }

    tryAdd(item: T) {
        const prevSize = this.#set.size;
        this.#set.add(item);
        return this.#set.size > prevSize;
    }

    has(item: T) {
        return this.#set.has(item);
    }

    clear() {
        this.#set.clear();
    }
}

export function defaultSortComparer<T>(a: T, b: T): 1 | -1 | 0 {
    return a < b ? -1 : a > b ? 1 : 0;
}

export function defaultEqualityComparer<T>(a: T, b: T): boolean {
    return a === b;
}

export function defaultElementSelector<T>(item: T): T {
    return item;
}

export function doneValue(): IteratorReturnResult<undefined> {
    return { done: true, value: undefined };
}

export function iteratorResultCreator<T>(value: T): IteratorYieldResult<T> {
    return { done: false, value };
}

export function emptyIterator<T>(): Iterator<T> {
    return {
        next() {
            return doneValue();
        },
    };
}

export function group<TValue, TKey, TElement>(
    iterable: Iterable<TValue>,
    keySelector: (item: TValue, index: number) => TKey,
    elementSelector: (item: TValue, index: number) => TElement): Map<TKey, FluentIterable<TElement>> {
    const map = new Map<TKey, TElement[]>();
    let i = 0;
    for (const item of iterable) {
        const key = keySelector(item, i);
        if ((key !== null && typeof key === 'object') || typeof key === "function") {
            throw new TypeError('groupBy method does not support keys to be objects or functions');
        }
        const element = elementSelector(item, i);
        const value = map.get(key) || [];
        value.push(element);
        map.set(key, value);
        i++;
    }
    return fromIterable(map).toMap(([key, _]) => key as TKey, ([_, value]) => from(value));
}

export function createIterable<T>(generator: () => Generator<T>): Iterable<T> {
    return {
        [Symbol.iterator]: generator,
    }
}

export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
