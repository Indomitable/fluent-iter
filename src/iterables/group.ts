import type {IGrouping} from "../fluent-iterable.ts";
import {createIterable, getIterator, group} from "../utils.ts";

export function groupByIterator<TValue, TKey, TElement, TResult>(
    source: Iterable<TValue>,
    keySelector: (item: TValue, index: number) => TKey,
    elementSelector?: (item: TValue, index: number) => TElement,
    resultCreator?: (key: TKey, items: Iterable<TElement>) => TResult): Iterable<IGrouping<TKey, TValue> | IGrouping<TKey, TElement> | TResult> {
    return createIterable(() => groupByGenerator(source, keySelector, elementSelector, resultCreator));
}

function* groupByGenerator<TValue, TKey, TElement=TValue, TResult=TValue>(
    source: Iterable<TValue>,
    keySelector: (item: TValue, index: number) => TKey,
    elementSelector?: (item: TValue, index: number) => TElement,
    resultCreator?: (key: TKey, items: Iterable<TElement>) => TResult): Generator<IGrouping<TKey, TValue> | IGrouping<TKey, TElement> | TResult> {
    const elementSelect: (item: TValue, index: number) => TElement = elementSelector ?? ((item) => item as unknown as TElement);
    const resultCreate: (key: TKey, items: Iterable<TElement>) => TResult = resultCreator ??
        ((key, items) => new Grouping(key, items) as unknown as TResult);

    const groups = group(source, keySelector, elementSelect);
    for (const [key, items] of groups.entries()) {
        yield resultCreate(key, items);
    }
}

export class Grouping<TKey, TValue> implements IGrouping<TKey, TValue> {
    readonly #key: TKey;
    readonly #items: Iterable<TValue>;
    constructor(key: TKey, items: Iterable<TValue>) {
        this.#key = key;
        this.#items = items;
    }

    public get key() {
        return this.#key;
    }

    [Symbol.iterator]() {
        return getIterator(this.#items);
    }
}
