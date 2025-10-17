import type {Predicate} from "../interfaces.ts";

export function allCollector<TValue>(source: Iterable<TValue>, predicate: Predicate<TValue>): boolean {
    for (const item of source) {
        if (!predicate(item)) {
            return false;
        }
    }
    return true;
}

export function allAndEveryCollector<TValue>(source: Iterable<TValue>, predicate: Predicate<TValue>): boolean {
    let hasItems = false;
    for (const item of source) {
        hasItems = true;
        if (!predicate(item)) {
            return false;
        }
    }
    return hasItems;
}
