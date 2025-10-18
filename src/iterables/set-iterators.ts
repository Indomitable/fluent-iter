//An Iterable that contains the elements from both input sequences, excluding duplicates.
import {SetCheck} from "../utils.ts";

export function distinctIterator<TValue, TKey=TValue>(source: Iterable<TValue>, keySelector?: (item: TValue) => TKey): Iterable<TValue> {
    const keySelectorFunc = keySelector ?? defaultKeySelector;
    const set = new SetCheck<TKey>();
    return {
        [Symbol.iterator]: function* (){
            for (const item of source) {
                const key = keySelectorFunc(item);
                if (set.tryAdd(key)) {
                    yield item;
                }
            }
        }
    };
}

export function unionIterator<TValue, TKey=TValue>(first: Iterable<TValue>, second: Iterable<TValue>, keySelector?: (item: TValue) => TKey): Iterable<TValue> {
    const keySelectorFunc = keySelector ?? defaultKeySelector;
    const set = new SetCheck<TKey>();
    return {
        [Symbol.iterator]: function* (){
            for (const f of first) {
                const key = keySelectorFunc(f);
                if (set.tryAdd(key)) {
                    yield f;
                }
            }
            for (const s of second) {
                const key = keySelectorFunc(s);
                if (set.tryAdd(key)) {
                    yield s;
                }
            }
        }
    };
}
//An Iterable that contains the elements from which are in the both input sequences, excluding duplicates.
export function intersectIterator<TValue, TKey>(first: Iterable<TValue>, second: Iterable<TValue>, keySelector?: (item: TValue) => TKey): Iterable<TValue> {
    const keySelectorFunc = keySelector ?? defaultKeySelector;
    const secondSet = new SetCheck<TKey>();
    for (const f of second) {
        const key = keySelectorFunc(f);
        secondSet.tryAdd(key);
    }
    const firstSet = new SetCheck<TKey>();
    return {
        [Symbol.iterator]: function* (){
            for (const f of first) {
                const key = keySelectorFunc(f);
                if (firstSet.tryAdd(key) && secondSet.has(key)) {
                    yield f;
                }
            }
        }
    };
}

//An Iterable that contains the elements that are in the first input sequence but not in the second input sequence.
export function diffIterator<TValue, TKey>(first: Iterable<TValue>, second: Iterable<TValue>, keySelector?: (item: TValue) => TKey): Iterable<TValue> {
    const keySelectorFunc = keySelector ?? defaultKeySelector;
    const secondSet = new SetCheck<TKey>();
    for (const f of second) {
        const key = keySelectorFunc(f);
        secondSet.tryAdd(key);
    }
    const firstSet = new SetCheck<TKey>();
    return {
        [Symbol.iterator]: function* (){
            for (const f of first) {
                const key = keySelectorFunc(f);
                if (firstSet.tryAdd(key) && !secondSet.has(key)) {
                    yield f;
                }
            }
        }
    };
}

export function symmetricDiffIterator<TValue, TKey>(first: Iterable<TValue>, second: Iterable<TValue>, keySelector?: (item: TValue) => TKey): Iterable<TValue> {
    const keySelectorFunc = keySelector ?? defaultKeySelector;
    const secondSet = new SetCheck<TKey>();
    for (const f of second) {
        const key = keySelectorFunc(f);
        secondSet.tryAdd(key);
    }
    const firstSet = new SetCheck<TKey>();
    const secondSet2 = new SetCheck<TKey>();
    return {
        [Symbol.iterator]: function* (){
            for (const f of first) {
                const key = keySelectorFunc(f);
                if (firstSet.tryAdd(key) && !secondSet.has(key)) {
                    yield f;
                }
            }
            for (const s of second) {
                const key = keySelectorFunc(s);
                if (secondSet2.tryAdd(key) && !firstSet.has(key)) {
                    yield s;
                }
            }
        }
    };
}

const defaultKeySelector = <TItem, TKey>(item: TItem) => item as unknown as TKey;
