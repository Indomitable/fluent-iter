import type {Comparer} from "../interfaces.js";
import {defaultSortComparer} from "../utils.js";

export function sortAscendingIterator<TValue, TKey=TValue>(input: Iterable<TValue>, keySelector: (item: TValue) => TKey, comparer?: Comparer<TKey>): Iterable<TValue> {
    const keyCompare = comparer ?? defaultSortComparer;
    const itemCompare = (left: TValue, right: TValue) => { return keyCompare(keySelector(left), keySelector(right)); };
    const arr = Array.from(input);
    return arr.sort(itemCompare);
}

export function sortDescendingIterator<TValue, TKey=TValue>(input: Iterable<TValue>, keySelector: (item: TValue) => TKey, comparer?: Comparer<TKey>): Iterable<TValue> {
    const keyCompare = comparer ?? defaultSortComparer;
    const itemCompare = (left: TValue, right: TValue) => { return 0 - keyCompare(keySelector(left), keySelector(right)); };
    const arr = Array.from(input);
    return arr.sort(itemCompare);
}
