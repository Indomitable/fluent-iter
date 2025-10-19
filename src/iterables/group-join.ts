import { FluentIterable } from "fluent-iter";
import {createIterable, defaultElementSelector, group} from "../utils.ts";
import {from} from "../creation.ts";

export default function groupJoinIterator<TThis, TOther, TKey, TResult>(
    source: Iterable<TThis>,
    joinIterable: Iterable<TOther>,
    sourceKeySelector: (sourceItem: TThis) => TKey,
    joinIterableKeySelector: (otherItem: TOther, index: number) => TKey,
    resultCreator: (first: TThis, second: FluentIterable<TOther>) => TResult): Iterable<TResult> {
    return createIterable(() => groupJoinGenerator(source, joinIterable, sourceKeySelector, joinIterableKeySelector, resultCreator));
}

function* groupJoinGenerator<TThis, TOther, TKey, TResult>(
    source: Iterable<TThis>,
    joinIterable: Iterable<TOther>,
    sourceKeySelector: (sourceItem: TThis) => TKey,
    joinIterableKeySelector: (otherItem: TOther, index: number) => TKey,
    resultCreator: (first: TThis, second: FluentIterable<TOther>) => TResult): Generator<TResult> {
    const innerMap = group(joinIterable, joinIterableKeySelector, defaultElementSelector);
    for (const outerItem of source) {
        const key = sourceKeySelector(outerItem);
        const innerItems = innerMap.get(key) || from([]);
        yield resultCreator(outerItem, innerItems);
    }
}
