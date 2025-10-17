import type {Predicate} from "../interfaces.ts";

export function single<TValue>(source: Iterable<TValue>, predicate?: Predicate<TValue>): TValue | never {
    let result;
    let count = 0;
    for (const item of source) {
        if ((predicate && predicate(item)) || !predicate) {
            result = item;
            count++;
        }
        if (count > 1) {
            throw new TypeError('Sequence contains multiple items');
        }
    }
    if (count === 0) {
        throw new TypeError('Sequence contains no items');
    }
    return result as TValue;
}

export function singleOrDefault<TValue>(source: Iterable<TValue>, def: TValue, predicate?: Predicate<TValue>): TValue | never {
    let result;
    let count = 0;
    for (const item of source) {
        if ((predicate && predicate(item)) || !predicate) {
            result = item;
            count++;
        }
        if (count > 1) {
            throw new TypeError('Sequence contains multiple items');
        }
    }
    if (count === 0) {
        return def;
    }
    return result as TValue;
}

