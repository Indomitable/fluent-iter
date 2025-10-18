import {defaultEqualityComparer, getIterator} from "../utils.ts";

// compare two iterables and return true if they have same items in same order
export function sequenceEqual<TFirst, TSecond=TFirst>(first: Iterable<TFirst>, second: Iterable<TSecond>, comparer?: (first: TFirst, second: TSecond) => boolean): boolean {
    const isEqual = comparer ?? defaultEqualityComparer;
    const firstIterator = getIterator(first);
    const secondIterator = getIterator(second);
    let thisDone = false;
    while (!thisDone) {
        const thisNext = firstIterator.next();
        const otherNext = secondIterator.next();
        if (thisNext.done !== otherNext.done ||
            (!thisNext.done && !otherNext.done && !isEqual(thisNext.value, otherNext.value))) {
            return false;
        }
        thisDone = thisNext.done ?? false;
    }
    return true;
}

// compare two iterables and return true if they have same items even in different order
export function isElementsEqual<TFirst, TSecond=TFirst>(first: Iterable<TFirst>, second: Iterable<TSecond>, comparer?: (first: TFirst, second: TSecond) => boolean): boolean {
    const isEqual = comparer ?? defaultEqualityComparer;
    const firstIterator = getIterator(first);
    const secondArray = Array.from(second);
    let thisDone = false;
    while (!thisDone) {
        const next = firstIterator.next();
        thisDone = next.done ?? false;
        if (!next.done && secondArray.length === 0 || next.done && secondArray.length > 0) {
            return false;
        }
        if (next.done && secondArray.length === 0) {
            return true;
        }
        const startLength = secondArray.length;
        for (let i = 0; i < secondArray.length; i++) {
            const otherValue = secondArray[i];
            if (isEqual(next.value, otherValue)) {
                secondArray.splice(i, 1);
                break;
            }
        }
        if (startLength === secondArray.length) {
            // if not removed not equal
            return false;
        }
    }
    return secondArray.length === 0; // all elements removed.
}
