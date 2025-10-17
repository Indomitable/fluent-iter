import type {Comparer} from "../interfaces.js";
import {defaultSortComparer, quickSort} from "../utils.js";

export function sortAscendingIterator<TValue, TKey=TValue>(input: Iterable<TValue>, keySelector: (item: TValue) => TKey, comparer?: Comparer<TKey>): Iterable<TValue> {
    const comp = comparer
        ? (left: TValue, right: TValue) => { return comparer(keySelector(left), keySelector(right)); }
        : (left: TValue, right: TValue) => { return defaultSortComparer(keySelector(left), keySelector(right)); };
    const arr = Array.from(input);
    return  quickSort(arr, 0, arr.length - 1, comp);
}

export function sortDescendingIterator<TValue, TKey=TValue>(input: Iterable<TValue>, keySelector: (item: TValue) => TKey, comparer?: Comparer<TKey>): Iterable<TValue> {
    const comp = comparer
        ? (left: TValue, right: TValue) => { return comparer(keySelector(left), keySelector(right)); }
        : (left: TValue, right: TValue) => { return defaultSortComparer(keySelector(left), keySelector(right)); };
    const negativeComp = (left: TValue, right: TValue) => { return 0 - comp(left, right); };
    const arr = Array.from(input);
    return quickSort(arr, 0, arr.length - 1, negativeComp);
}
