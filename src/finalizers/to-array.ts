import type {Mapper} from "../interfaces.ts";

export function toArrayCollector<T, R>(source: Iterable<T>, map?: Mapper<T, R>): T[] | R[] {
    if (!map) {
        return Array.from(source);
    } else {
        return Array.from(source).map(map);
    }
}

export async function toArrayAsyncCollector<T, R>(source: AsyncIterable<T>, map?: Mapper<T, R>): Promise<(T|R)[]> {
    const result: (T|R)[] = [];
    for await (const item of source) {
        if (map) {
            result.push(map(item));
        } else {
            result.push(item);
        }
    }
    return result;
}

export async function toMapAsyncCollector<TValue, TKey, TElement>(
    source: AsyncIterable<TValue>,
    keySelector: (item: TValue) => TKey,
    elementSelector?: (item: TValue) => TElement): Promise<Map<TKey, TValue|TElement>> {
    const map = new Map<TKey, TValue|TElement>();
    for await (const item of source) {
        map.set(keySelector(item), elementSelector ? elementSelector(item) : item);
    }
    return map;
}
