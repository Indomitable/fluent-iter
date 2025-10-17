import {IterableGenerator} from "../utils.js";

/**
 * Return flatten mapped array [[1, 2], [3, 4]].selectMany(x => x) === [1, 2, 3, 4, 5]
 */
export default function selectManyIterator<TValue, TInner, TResult>(
    input: Iterable<TValue>,
    innerSelector: (item: TValue) => TInner[],
    resultCreator?: (outer: TValue, inner: TInner) => TResult): Iterable<TInner | TResult> {
    return new IterableGenerator(() => selectManyGenerator(input, innerSelector, resultCreator));
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
