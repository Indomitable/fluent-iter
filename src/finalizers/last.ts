import {Predicate} from "../interfaces.js";

export function last<TValue>(source: Iterable<TValue>, predicate?: Predicate<TValue>): TValue | undefined {
    let value;
    for (const item of source) {
        if (!predicate || predicate(item)) {
            value = item;
        }
    }
    return value;
}

export function lastOrDefault<TValue>(source: Iterable<TValue>, def: TValue, predicate?: Predicate<TValue>): TValue {
    let [found, value] = lastItem(source, predicate);
    return found ? value as TValue : def;
}

export function lastOrThrow<TValue>(source: Iterable<TValue>, predicate?: Predicate<TValue>): TValue | never {
    let [found, value] = lastItem(source, predicate);
    if (found) {
        return value as TValue;
    }
    throw new TypeError('Sequence contains no items');
}

export function lastIndex<TValue>(source: Iterable<TValue>, predicate: Predicate<TValue>): number {
    let i = -1;
    let itemIndex = i;
    for (const item of source) {
        i++;
        if (predicate(item)) {
            itemIndex = i
        }
    }
    return itemIndex;
}

type FoundItem<TFound extends boolean, TValue> = TFound extends true ? [true, TValue] : [false, undefined];

const lastItem = <TValue>(source: Iterable<TValue>, predicate?: Predicate<TValue>): FoundItem<boolean, TValue> => {
    let value;
    let found = false;
    for (const item of source) {
        if (!predicate || predicate(item)) {
            value = item;
            found = true;
        }
    }
    return [found, value] as FoundItem<boolean, TValue>;
}
