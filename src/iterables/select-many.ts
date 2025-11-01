import {createIterable} from "../utils.ts";
import {Mapper} from "../interfaces.ts";

/**
 * Return flatten mapped array [[1, 2], [3, 4]].selectMany(x => x) === [1, 2, 3, 4, 5]
 */
export function selectManyIterator<TValue, TInner>(
    input: Iterable<TValue>,
    innerSelector: (item: TValue) => TInner[]): Iterable<TInner>;
export function selectManyIterator<TValue, TInner, TResult>(
    input: Iterable<TValue>,
    innerSelector: (item: TValue) => TInner[],
    resultCreator: (outer: TValue, inner: TInner) => TResult): Iterable<TResult>;
export function selectManyIterator<TValue, TInner, TResult>(
    input: Iterable<TValue>,
    innerSelector: (item: TValue) => TInner[],
    resultCreator?: (outer: TValue, inner: TInner) => TResult): Iterable<TInner | TResult> {
    return createIterable(() => selectManyGenerator(input, innerSelector, resultCreator));
}

export function flatIterator<TValue>(input: Iterable<TValue>, depth: number): Iterable<TValue> {
    return createIterable(() => flatGenerator(input, depth, 0));
}

export function flatMapIterator<TValue, TResult>(input: Iterable<TValue>, mapper: Mapper<TValue, TResult | readonly TResult[]>): Iterable<TResult> {
    return createIterable(() => flatMapGenerator(input, mapper));
}

export function* flatGenerator<TValue>(input: Iterable<TValue>, depth: number, level: number): Generator<TValue> {
    for (const item of input) {
        if (Array.isArray(item)) {
            if (level >= depth) {
                yield item;
            } else {
                level++;
                yield* flatGenerator(item, depth, level);
                level--;
            }
        } else {
            yield item;
        }
    }
}

export function* flatMapGenerator<TValue, TResult>(input: Iterable<TValue>, mapper: Mapper<TValue, TResult | readonly TResult[]>): Generator<TResult> {
    for (const item of input) {
        if (Array.isArray(item)) {
            yield* item.map(mapper) as TResult[];
        } else {
            yield mapper(item) as TResult;
        }
    }
}

export function* selectManyGenerator<TValue, TInner, TResult>(
    input: Iterable<TValue>,
    innerSelector: (item: TValue) => TInner[],
    resultCreator?: (outer: TValue, inner: TInner) => TResult): Generator<TInner | TResult> {
    for (const item of input) {
        if (!resultCreator) {
            yield* innerSelector(item);
        } else {
            const items = innerSelector(item);
            for (const innerItem of items) {
                yield resultCreator(item, innerItem);
            }
        }
    }
}
