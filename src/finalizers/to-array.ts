import { LinqIterable } from "../linq-iterable";

interface SourceIterable<T> extends LinqIterable<T> {
    get(): T[] | Iterable<T>;
}

export class ToArrayFinalizer {
    static get<T, R>(source: SourceIterable<T>): T[];
    static get<T, R>(source: SourceIterable<T>, map: (e: T) => R): R[];
    static get<T, R>(source: SourceIterable<T>, map?: (e: T) => R): T[] | R[] {
        if (!map) {
            const iterable = source.get();
            return Array.isArray(iterable) ? iterable : Array.from(iterable);
        } else {
            return source.select(map).toArray();
        }
    }
}

interface ArrrayIterable<T> {
    get(): T[];
}

/**
 * Return it is toArray finalizer which is used when source.get is 100% an array.
 * Used in native array iterators
 */
export class ToArrayArrayFinalizer {
    static get<T, R>(source: ArrrayIterable<T>): T[];
    static get<T, R>(source: ArrrayIterable<T>, mapper: (e: T) => R): R[];
    static get<T, R>(source: ArrrayIterable<T>, mapper?: (e: T) => R): T[] | R[] {
        if (!mapper) {
            return source.get();
        }
        return source.get().map(mapper);
    }
}
