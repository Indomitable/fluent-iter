import {
    defaultElementSelector,
    group,
    IterableGenerator,
} from "../utils.ts";

export default function joinIterator<TThis, TOther, TKey, TResult>(
    source: Iterable<TThis>,
    joinIterable: Iterable<TOther>,
    sourceKeySelector: (sourceItem: TThis) => TKey,
    joinIterableKeySelector: (otherItem: TOther, index: number) => TKey,
    resultCreator: (first: TThis, second: TOther) => TResult): Iterable<TResult> {
    return new IterableGenerator(() => joinGenerator(source, joinIterable, sourceKeySelector, joinIterableKeySelector, resultCreator));
}

function* joinGenerator<TThis, TOther, TKey, TResult>(
    source: Iterable<TThis>,
    joinIterable: Iterable<TOther>,
    sourceKeySelector: (sourceItem: TThis) => TKey,
    joinIterableKeySelector: (otherItem: TOther, index: number) => TKey,
    resultCreator: (first: TThis, second: TOther) => TResult): Generator<TResult> {
    const innerMap = group(joinIterable, joinIterableKeySelector, defaultElementSelector);
    for (const outerItem of source) {
        const key = sourceKeySelector(outerItem);
        const innerItems = innerMap.get(key) || [];
        for (const innerItem of innerItems) {
            yield resultCreator(outerItem, innerItem);
        }
    }
}