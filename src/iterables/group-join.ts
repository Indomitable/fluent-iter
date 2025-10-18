import {createIterable, defaultElementSelector, group} from "../utils.ts";

export default function groupJoinIterator<TThis, TOther, TKey, TResult>(
    source: Iterable<TThis>,
    joinIterable: Iterable<TOther>,
    sourceKeySelector: (sourceItem: TThis) => TKey,
    joinIterableKeySelector: (otherItem: TOther, index: number) => TKey,
    resultCreator: (first: TThis, second: TOther[]) => TResult): Iterable<TResult> {
    return createIterable(() => groupJoinGenerator(source, joinIterable, sourceKeySelector, joinIterableKeySelector, resultCreator));
}

function* groupJoinGenerator<TThis, TOther, TKey, TResult>(
    source: Iterable<TThis>,
    joinIterable: Iterable<TOther>,
    sourceKeySelector: (sourceItem: TThis) => TKey,
    joinIterableKeySelector: (otherItem: TOther, index: number) => TKey,
    resultCreator: (first: TThis, second: TOther[]) => TResult): Generator<TResult> {
    const innerMap = group(joinIterable, joinIterableKeySelector, defaultElementSelector);
    for (const outerItem of source) {
        const key = sourceKeySelector(outerItem);
        const innerItems = innerMap.get(key) || [];
        yield resultCreator(outerItem, innerItems);
    }
}
