import {whereIterator} from "./iterables/where.ts";
import {selectIterator} from "./iterables/select.ts";
import {selectManyIterator, flatIterator, flatMapIterator} from "./iterables/select-many.ts";
import {takeIterator} from "./iterables/take.ts";
import {skipIterator} from "./iterables/skip.ts";
import {toArrayCollector} from "./finalizers/to-array.ts";
import {takeWhileIterator} from "./iterables/take-while.ts";
import {skipWhileIterator} from "./iterables/skip-while.ts";
import takeLastIterator from "./iterables/take-last.ts";
import skipLastIterator from "./iterables/skip-last.ts";
import {allAndEveryCollector, allCollector} from "./finalizers/all.ts";
import anyCollector from "./finalizers/any.ts";
import countCollector from "./finalizers/count.ts";
import aggregateCollector from "./finalizers/aggregate.ts";
import {defaultSortComparer} from "./utils.ts";
import elementAtCollector from "./finalizers/element-at.ts";
import forEachCollector from "./finalizers/for-each.ts";
import {isElementsEqual, sequenceEqual} from "./finalizers/equal.ts";
import {single, singleOrDefault} from "./finalizers/single.ts";
import {last, lastIndex, lastOrDefault, lastOrThrow} from "./finalizers/last.ts";
import {first, firstIndex, firstOrDefault, firstOrThrow} from "./finalizers/first.ts";
import reverseIterator from "./iterables/reverse.ts";
import {pageIterator} from "./iterables/page.ts";
import {
    diffIterator,
    distinctIterator,
    intersectIterator,
    symmetricDiffIterator,
    unionIterator
} from "./iterables/set-iterators.ts";
import concatIterator from "./iterables/concat.ts";
import {sortAscendingIterator, sortDescendingIterator} from "./iterables/order.ts";
import {groupByIterator} from "./iterables/group.ts";
import joinIterator from "./iterables/join.ts";
import groupJoinIterator from "./iterables/group-join.ts";
import zipIterable from "./iterables/zip.js";

import type {Action, Comparer, Mapper, Predicate} from "./interfaces.ts";
import type {FlatFluentIterable, FluentIterable, IGrouping} from 'fluent-iter';

export default class Fluent<TValue> implements FluentIterable<TValue> {
    readonly #source: Iterable<TValue>;

    constructor(source: Iterable<TValue>) {
        this.#source = source;
    }

    where<TSubValue extends TValue>(predicate: (item: TValue) => item is TSubValue): FluentIterable<TSubValue>;
    where(predicate: Predicate<TValue>): FluentIterable<TValue>;
    where<TSubValue>(predicate: Predicate<TValue>): FluentIterable<TValue> | FluentIterable<TSubValue> {
        return new Fluent(whereIterator(this, predicate));
    }

    select<TOutput>(map: Mapper<TValue, TOutput>): FluentIterable<TOutput> {
        return new Fluent(selectIterator(this, map));
    }

    flat(depth: number = 1): FlatFluentIterable<TValue> {
        return new Fluent(flatIterator(this, depth)) as any;
    }

    flatMap<TResult>(mapper: (value: TValue) => TResult | ReadonlyArray<TResult>): FluentIterable<TResult> {
        return new Fluent(flatMapIterator(this, mapper));
    }

    selectMany<TInner, TResult>(innerSelector: (item: TValue) => TInner[], resultCreator?: (outer: TValue, inner: TInner) => TResult): FluentIterable<TInner | TResult> {
        if (typeof resultCreator !== 'undefined') {
            return new Fluent(selectManyIterator(this, innerSelector, resultCreator));
        }
        return new Fluent(selectManyIterator(this, innerSelector));
    }

    take(count: number): FluentIterable<TValue> {
        return new Fluent(takeIterator(this, count));
    }

    takeWhile(condition: (item: TValue, index: number) => boolean): FluentIterable<TValue> {
        return new Fluent(takeWhileIterator(this, condition));
    }

    takeLast(count: number): FluentIterable<TValue> {
        return new Fluent(takeLastIterator(this, count));
    }

    skip(count: number): FluentIterable<TValue> {
        return new Fluent(skipIterator(this, count));
    }

    skipWhile(condition: (item: TValue, index: number) => boolean): FluentIterable<TValue> {
        return new Fluent(skipWhileIterator(this, condition));
    }

    skipLast(count: number): FluentIterable<TValue> {
        return new Fluent(skipLastIterator(this, count));
    }

    distinct<TKey>(keySelector?: (item: TValue) => TKey): FluentIterable<TValue> {
        return new Fluent(distinctIterator(this, keySelector));
    }

    ofType<TOutput extends TValue>(type: 'string' | 'number' | 'boolean' | 'undefined' | 'function' | 'object' | 'symbol' | ((item: TValue) => item is TOutput)): FluentIterable<TOutput> {
        const filter = typeof type === 'function' ? type : (item: TValue) => typeof item === type;
        return new Fluent<TOutput>(whereIterator<TValue>(this, filter) as Iterable<TOutput>);
    }

    ofClass<TOutput extends TValue>(type: {
        new(...args: any[]): TOutput,
        prototype: TOutput
    }): FluentIterable<TOutput> {
        const filter = (item: TValue) => item instanceof type;
        return new Fluent<TOutput>(whereIterator<TValue>(this, filter) as Iterable<TOutput>);
    }

    groupBy<TKey>(keySelector: (item: TValue, index: number) => TKey): FluentIterable<IGrouping<TKey, TValue>>;
    groupBy<TKey, TElement>(keySelector: (item: TValue, index: number) => TKey, elementSelector: (item: TValue, index: number) => TElement): FluentIterable<IGrouping<TKey, TElement>>;
    groupBy<TKey, TElement, TResult>(keySelector: (item: TValue, index: number) => TKey, elementSelector: (item: TValue, index: number) => TElement, resultCreator: (key: TKey, items: FluentIterable<TElement>) => TResult): FluentIterable<TResult>;
    groupBy<TKey, TElement, TResult>(keySelector: (item: TValue, index: number) => TKey,
                                     elementSelector?: (item: TValue, index: number) => TElement,
                                     resultCreator?: (key: TKey, items: FluentIterable<TElement>) => TResult): FluentIterable<IGrouping<TKey, TValue> | IGrouping<TKey, TElement> | TResult> {
        return new Fluent(groupByIterator(this, keySelector, elementSelector, resultCreator));
    }

    orderBy<TKey>(keySelector: (item: TValue) => TKey, comparer?: Comparer<TKey>): FluentIterable<TValue> {
        return new Fluent(sortAscendingIterator(this, keySelector, comparer));
    }

    orderByDescending<TKey>(keySelector: (item: TValue) => TKey, comparer?: Comparer<TKey>): FluentIterable<TValue> {
        return new Fluent(sortDescendingIterator(this, keySelector, comparer));
    }

    groupJoin<TInner, TKey, TResult>(joinIterable: Iterable<TInner>,
                                     sourceKeySelector: (item: TValue) => TKey,
                                     joinIterableKeySelector: (item: TInner, index: number) => TKey,
                                     resultCreator: (outer: TValue, inner: FluentIterable<TInner> & TInner[]) => TResult): FluentIterable<TResult> {
        return new Fluent(groupJoinIterator(this, joinIterable, sourceKeySelector, joinIterableKeySelector, resultCreator as any));
    }

    join(separator: string): string;
    join<TInner, TKey, TResult>(joinIterable: Iterable<TInner>,
                                sourceKeySelector: (item: TValue) => TKey,
                                joinIterableKeySelector: (item: TInner, index: number) => TKey,
                                resultCreator: (outer: TValue, inner: TInner) => TResult): FluentIterable<TResult>;
    join<TInner, TKey, TResult>(firstArgument: Iterable<TInner> | string,
                                sourceKeySelector?: (item: TValue) => TKey,
                                joinIterableKeySelector?: (item: TInner, index: number) => TKey,
                                resultCreator?: (outer: TValue, inner: TInner) => TResult): FluentIterable<TResult> | string {
        if (typeof firstArgument === 'string') {
            return this.select(item => '' + item).toArray().join(firstArgument);
        }
        return new Fluent(joinIterator(this, firstArgument, sourceKeySelector!, joinIterableKeySelector!, resultCreator!));
    }

    concat(secondIterable: Iterable<TValue>): FluentIterable<TValue> {
        return new Fluent(concatIterator(this, secondIterable));
    }

    union<TKey = TValue>(secondIterable: Iterable<TValue>, keySelector?: (item: TValue) => TKey): FluentIterable<TValue> {
        return new Fluent(unionIterator(this, secondIterable, keySelector));
    }

    intersect<TKey = TValue>(secondIterable: Iterable<TValue>, keySelector?: (item: TValue) => TKey): FluentIterable<TValue> {
        return new Fluent(intersectIterator(this, secondIterable, keySelector));
    }

    difference<TKey = TValue>(secondIterable: Iterable<TValue>, keySelector?: (item: TValue) => TKey): FluentIterable<TValue> {
        return new Fluent(diffIterator(this, secondIterable, keySelector));
    }

    symmetricDifference<TKey = TValue>(secondIterable: Iterable<TValue>, keySelector?: (item: TValue) => TKey): FluentIterable<TValue> {
        return new Fluent(symmetricDiffIterator(this, secondIterable, keySelector));
    }

    page(pageSize: number): FluentIterable<TValue[]> {
        return new Fluent(pageIterator(this, pageSize));
    }

    reverse(): FluentIterable<TValue> {
        return new Fluent(reverseIterator(this));
    }

    toArray(): TValue[];
    toArray<TResult>(map: Mapper<TValue, TResult>): TResult[];
    toArray<TResult>(map?: Mapper<TValue, TResult>): TValue[] | TResult[] {
        return toArrayCollector(this, map);
    }

    zip<TOuter>(second: Iterable<TOuter>): FluentIterable<[TValue, TOuter]> {
        return new Fluent(zipIterable(this, second));
    }

    toMap<TKey>(keySelector: (item: TValue) => TKey): Map<TKey, TValue>;
    toMap<TKey, TElement>(keySelector: (item: TValue) => TKey, elementSelector: (item: TValue) => TElement): Map<TKey, TElement>;
    toMap<TKey, TElement>(keySelector: (item: TValue) => TKey, elementSelector?: (item: TValue) => TElement): Map<TKey, TValue | TElement> {
        return new Map(this.select(item => [keySelector(item), elementSelector ? elementSelector(item) : item]));
    }

    toSet(): Set<TValue> {
        return new Set<TValue>(this);
    }

    first(predicate?: Predicate<TValue>): TValue | undefined {
        return first(this, predicate);
    }

    firstOrDefault(def: TValue, predicate?: Predicate<TValue>): TValue {
        return firstOrDefault(this, def, predicate);
    }

    firstOrThrow(predicate?: Predicate<TValue>): TValue | never {
        return firstOrThrow(this, predicate);
    }

    firstIndex(predicate: Predicate<TValue>): number {
        return firstIndex(this, predicate);
    }

    last(predicate?: Predicate<TValue>): TValue | undefined {
        return last(this, predicate);
    }

    lastOrDefault(def: TValue, predicate?: Predicate<TValue>): TValue {
        return lastOrDefault(this, def, predicate);
    }

    lastOrThrow(predicate?: Predicate<TValue>): TValue | never {
        return lastOrThrow(this, predicate);
    }

    lastIndex(predicate: (item: TValue) => boolean): number {
        return lastIndex(this, predicate);
    }

    single(predicate?: Predicate<TValue>): TValue | never {
        return single(this, predicate);
    }

    singleOrDefault(def: TValue, predicate?: Predicate<TValue>): TValue | never {
        return singleOrDefault(this, def, predicate);
    }

    all(predicate: (item: TValue) => boolean): boolean {
        return allCollector(this, predicate);
    }

    allAndEvery(predicate: (item: TValue) => boolean): boolean {
        return allAndEveryCollector(this, predicate);
    }

    any(predicate?: ((item: TValue) => boolean) | undefined): boolean {
        return anyCollector(this, predicate);
    }

    count(predicate?: ((item: TValue) => boolean) | undefined): number {
        return countCollector(this, predicate);
    }

    aggregate(accumulator: (result: TValue, item: TValue, index: number) => TValue): TValue | never;
    aggregate<TResult = TValue>(accumulator: (result: TResult, item: TValue, index: number) => TResult, initial: TResult): TResult;
    aggregate<TResult = TValue>(accumulator: (result: TResult, item: TValue, index: number) => TResult, initial?: TResult): TResult | TValue | never {
        return aggregateCollector(this, accumulator, initial);
    }

    sum(): TValue {
        return aggregateCollector(this, (a, i) => (a as any) + (i as any) as any);
    }

    product(): TValue {
        return aggregateCollector(this, (a, i) => (a as any) * (i as any) as any);
    }

    min(comparer?: Comparer<TValue>): TValue | never {
        const compare = comparer ?? defaultSortComparer;
        return aggregateCollector(this, (a, b) => {
            const comp = compare(a, b);
            return comp < 0 ? a : (comp > 0 ? b : a);
        });
    }

    max(comparer?: Comparer<TValue>): TValue | never {
        const compare = typeof comparer === 'undefined' ? defaultSortComparer : comparer;
        return aggregateCollector(this, (a, b) => {
            const comp = compare(a, b);
            return comp < 0 ? b : (comp > 0 ? a : b);
        });
    }

    elementAt(index: number): TValue | undefined {
        return elementAtCollector(this, index);
    }

    forEach(action: Action<TValue>): void {
        return forEachCollector(this, action);
    }

    isEqual(iterable: Iterable<TValue>): boolean;
    isEqual<TSecond = TValue>(second: Iterable<TSecond>, comparer: (a: TValue, b: TSecond) => boolean): boolean;
    isEqual<TSecond = TValue>(second: Iterable<TSecond>, comparer?: (first: TValue, second: TSecond) => boolean): boolean {
        return sequenceEqual(this, second, comparer);
    }

    isElementsEqual(iterable: Iterable<TValue>): boolean;
    isElementsEqual<TSecond = TValue>(second: Iterable<TSecond>, comparer: (a: TValue, b: TSecond) => boolean): boolean;
    isElementsEqual<TSecond = TValue>(second: Iterable<TSecond>, comparer?: (first: TValue, second: TSecond) => boolean): boolean {
        return isElementsEqual(this, second, comparer);
    }

    [Symbol.iterator](): Iterator<TValue, any, any> {
        return this.#source[Symbol.iterator]();
    }
}

export class Grouping<TKey, TValue> extends Fluent<TValue> implements IGrouping<TKey, TValue> {
    readonly #key: TKey;

    constructor(key: TKey, items: Iterable<TValue>) {
        super(items);
        this.#key = key;
    }

    public get key() {
        return this.#key;
    }
}
