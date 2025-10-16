import { LinqIterable } from './linq-iterable.ts';
import linqMixin from './linq-mixin.js';

// /**
//  * Apply mixin to a class
//  * @param {object} mixin
//  * @param {Function[]} destinations
//  */
// export function applyMixin(mixin: object, destinations: Function[]) {
//     const keys = Object.keys(mixin);
//     for (const dest of destinations) {
//         for (const mixinKey of keys) {
//             if (!dest.prototype[mixinKey]) {
//                 dest.prototype[mixinKey] = mixin[mixinKey];
//             }
//         }
//     }
// }

export function applyMixin<T extends object>(
    mixin: T,
    destinations: Function[]
): void {
    Object.getOwnPropertyNames(mixin).forEach((key) => {
        destinations.forEach((dest) => {
            if (!(key in dest.prototype)) {
                Object.defineProperty(
                    dest.prototype,
                    key,
                    Object.getOwnPropertyDescriptor(mixin, key) || {
                        value: mixin[key as keyof T],
                    }
                );
            }
        });
    });
}

// export function LinqMixin<T>() {
//     return function <C extends { new(...args: any[]): any }>(
//         constructor: C
//     ): C & { new(...args: any[]): InstanceType<C> & LinqIterable<T> } {
//         Object.getOwnPropertyNames(linqMixin).forEach((key) => {
//             Object.defineProperty(
//                 constructor.prototype,
//                 key,
//                 Object.getOwnPropertyDescriptor(linqMixin, key) || {
//                     value: linqMixin[key as keyof LinqIterable<T>],
//                 }
//             );
//         });
//         return constructor as any;
//     };
// }

/**
 * Helper function to be use to access Symbol.iterator of iterable
 * @param {Iterable} iterable
 * @return {Iterator} iterator.
 */
export function getIterator<T>(iterable: Iterable<T>): Iterator<T> {
    return iterable[Symbol.iterator]();
}

function __quickSort<T>(items: T[], left: number, right: number, comparer: (a: T, b: T) => number) {
    do {
        let i = left;
        let j = right;
        let x = items[i + ((j - i) >> 1)];
        do {
            while (i < items.length && comparer(x, items[i]) > 0) i++;
            while (j >= 0 && comparer(x, items[j]) < 0) j--;
            if (i > j) break;
            if (i < j) {
                [items[i], items[j]] = [items[j], items[i]];
            }
            i++;
            j--;
        } while (i <= j);
        if (j - left <= right - i) {
            if (left < j) __quickSort(items, left, j, comparer);
            left = i;
        } else {
            if (i < right) __quickSort(items, i, right, comparer);
            right = j;
        }
    } while (left < right);
}

/**
 * Sorts an array using quick sort algorithm
 * @param items array to sort
 * @param left start
 * @param right end
 * @param comparer elements comparer
 * @return {Array} sorted array.
 */
export function quickSort<T>(items: T[], left: number, right: number, comparer: (a: T, b: T) => number): T[] {
    const copy = [...items]; // copy items.
    __quickSort(copy, left, right, comparer);
    return copy;
}

export function __search<T>(items: T[], value: T, start: number, end: number, comparer: (a: T, b: T) => number): number {
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
export function search<T>(items: T[], value: T, comparer: (a: T, b: T) => number): number {
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
export function insertOrdered<T>(items: T[], value: T, comparer: (a: T, b: T) => number): T[] {
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

    clear() {
        this.#set.clear();
    }
}

export function defaultSortComparer(a: number, b: number): 1 | -1 | 0 {
    return a < b ? -1 : a > b ? 1 : 0;
}

export function defaultEqualityComparer(a: number, b: number): boolean {
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

export class IterableGenerator<T> implements Iterable<T> {
    readonly #generator: () => Generator<T>;
    constructor(generator: () => Generator<T>) {
        this.#generator = generator;
    }

    [Symbol.iterator]() {
        return this.#generator();
    }
}
