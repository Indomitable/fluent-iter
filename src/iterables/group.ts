import type {FluentIterable, IGrouping} from "fluent-iter";
import {createAsyncIterable, createIterable, group, groupAsync} from "../utils.ts";
import {Grouping} from "../fluent.js";

export function groupByIterator<TValue, TKey, TElement, TResult>(
    source: Iterable<TValue>,
    keySelector: (item: TValue, index: number) => TKey,
    elementSelector?: (item: TValue, index: number) => TElement,
    resultCreator?: (key: TKey, items: FluentIterable<TElement>) => TResult): Iterable<IGrouping<TKey, TValue> | IGrouping<TKey, TElement> | TResult> {
    return createIterable(() => groupByGenerator(source, keySelector, elementSelector, resultCreator));
}

function* groupByGenerator<TValue, TKey, TElement=TValue, TResult=TValue>(
    source: Iterable<TValue>,
    keySelector: (item: TValue, index: number) => TKey,
    elementSelector?: (item: TValue, index: number) => TElement,
    resultCreator?: (key: TKey, items: FluentIterable<TElement>) => TResult): Generator<IGrouping<TKey, TValue> | IGrouping<TKey, TElement> | TResult> {
    const elementSelect: (item: TValue, index: number) => TElement = elementSelector ?? ((item) => item as unknown as TElement);
    const resultCreate: (key: TKey, items: FluentIterable<TElement>) => TResult = resultCreator ??
        ((key, items) => new Grouping(key, items) as unknown as TResult);

    const groups = group(source, keySelector, elementSelect);
    for (const [key, items] of groups.entries()) {
        yield resultCreate(key, items);
    }
}

export function groupByAsyncIterator<TValue, TKey, TElement, TResult>(
    source: AsyncIterable<TValue>,
    keySelector: (item: TValue, index: number) => TKey,
    elementSelector?: (item: TValue, index: number) => TElement,
    resultCreator?: (key: TKey, items: FluentIterable<TElement>) => TResult): AsyncIterable<IGrouping<TKey, TValue> | IGrouping<TKey, TElement> | TResult> {
    return createAsyncIterable(() => groupByAsyncGenerator(source, keySelector, elementSelector, resultCreator));
}

async function* groupByAsyncGenerator<TValue, TKey, TElement = TValue, TResult = TValue>(
    source: AsyncIterable<TValue>,
    keySelector: (item: TValue, index: number) => TKey,
    elementSelector?: (item: TValue, index: number) => TElement,
    resultCreator?: (key: TKey, items: FluentIterable<TElement>) => TResult): AsyncGenerator<IGrouping<TKey, TValue> | IGrouping<TKey, TElement> | TResult> {
    const elementSelect: (item: TValue, index: number) => TElement = elementSelector ?? ((item) => item as unknown as TElement);
    const resultCreate: (key: TKey, items: FluentIterable<TElement>) => TResult = resultCreator ??
        ((key, items) => new Grouping(key, items) as unknown as TResult);

    const groups = await groupAsync(source, keySelector, elementSelect);
    for (const [key, items] of groups.entries()) {
        yield resultCreate(key, items);
    }
}
