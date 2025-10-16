import type {InternalIterable, Mapper} from "../interfaces.ts";

export function toArrayCollector<T, R>(source: InternalIterable<T>, map?: Mapper<T, R>): T[] | R[] {
    const inner = source.getInner();
    if (!map) {
        return Array.isArray(inner) ? inner : Array.from(source);
    } else {
        return Array.isArray(inner) ? inner.map(map) : Array.from(source).map(map);
    }
}

// export class ToArrayFinalizer {
//     static get<T, R>(source: InternalIterable<T>): T[];
//     static get<T, R>(source: InternalIterable<T>, map: Mapper<T, R>): R[];
//     static get<T, R>(source: InternalIterable<T>, map?: Mapper<T, R>): T[] | R[] {
//         if (!map) {
//             const iterable = source.getInner();
//             return Array.isArray(iterable) ? iterable : Array.from(iterable);
//         } else {
//             return (source as any as LinqIterable<T>).select(map).toArray();
//         }
//     }
// }

interface ArrrayIterable<T> {
    get(): T[];
}

/**
 * Return it is toArray finalizer which is used when source.get is 100% an array.
 * Used in native array iterators
 */
export class ToArrayArrayFinalizer {
    public static get<T, R>(source: ArrrayIterable<T>): T[];
    public static get<T, R>(source: ArrrayIterable<T>, mapper: Mapper<T, R>): R[];
    public static get<T, R>(source: ArrrayIterable<T>, mapper?: Mapper<T, R>): T[] | R[] {
        if (!mapper) {
            return source.get();
        }
        return source.get().map(mapper);
    }
}
