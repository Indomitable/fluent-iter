import type {Predicate} from "../interfaces.ts";

export function first<TValue>(source: Iterable<TValue>, predicate?: Predicate<TValue>): TValue | undefined {
    for (const item of source) {
        if (!predicate || predicate(item)) {
            return item;
        }
    }
}

export function firstOrDefault<TValue>(source: Iterable<TValue>, def: TValue, predicate?: Predicate<TValue>): TValue {
    for (const item of source) {
        if (!predicate || predicate(item)) {
            return item;
        }
    }
    return def;
}

export function firstOrThrow<TValue>(source: Iterable<TValue>, predicate?: Predicate<TValue>): TValue | never {
    for (const item of source) {
        if (!predicate || predicate(item)) {
            return item;
        }
    }
    throw new TypeError('Sequence contains no items');
}

export function firstIndex<TValue>(source: Iterable<TValue>, predicate: Predicate<TValue>): number {
    let i = 0;
    for (const item of source) {
        if (predicate(item)) {
            return i;
        }
        i++;
    }
    return -1;
}

