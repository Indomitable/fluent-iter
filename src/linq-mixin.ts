import whereIterator from "./iterables/where.ts";
import selectIterator from "./iterables/select.ts";
import selectManyIterator from "./iterables/select-many.ts";
import takeIterator from "./iterables/take.ts";
import skipIterator from "./iterables/skip.ts";
import toArrayCollector from "./finalizers/to-array.ts";
import takeWhileIterator from "./iterables/take-while.ts";
import skipWhileIterator from "./iterables/skip-while.ts";
import takeLastIterator from "./iterables/take-last.ts";
import skipLastIterator from "./iterables/skip-last.ts";
import distinctIterator from "./iterables/distinct.ts";
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
import pageIterator from "./iterables/page.ts";
import {intersectIterator, unionIterator} from "./iterables/set-iterators.ts";
import concatIterator from "./iterables/concat.ts";
import {sortAscendingIterator, sortDescendingIterator} from "./iterables/order.ts";
import {groupByIterator} from "./iterables/group.ts";

import type {Action, Comparer, Equality, Mapper, Predicate} from "./interfaces.ts";
import type { IGrouping, LinqIterable} from "./linq-iterable.ts";

export class Linq<TValue> implements LinqIterable<TValue> {
    readonly #source: Iterable<TValue>;

    constructor(source: Iterable<TValue>) {
        this.#source = source;
    }

    where<TSubValue extends TValue>(predicate: (item: TValue) => item is TSubValue): LinqIterable<TSubValue>;
    where(predicate: Predicate<TValue>): LinqIterable<TValue>;
    where<TSubValue>(predicate: Predicate<TValue>): LinqIterable<TValue> | LinqIterable<TSubValue> {
        return new Linq(whereIterator(this, predicate));
    }
    select<TOutput>(map: Mapper<TValue, TOutput>): LinqIterable<TOutput> {
        return new Linq(selectIterator(this, map));
    }
    selectMany<TInner, TResult>(innerSelector: (item: TValue) => TInner[], resultCreator?: (outer: TValue, inner: TInner) => TResult): LinqIterable<TInner | TResult> {
        return new Linq(selectManyIterator(this, innerSelector, resultCreator));
    }
    take(count: number): LinqIterable<TValue> {
        return new Linq(takeIterator(this, count));
    }
    takeWhile(condition: (item: TValue, index: number) => boolean): LinqIterable<TValue> {
        return new Linq(takeWhileIterator(this, condition));
    }
    takeLast(count: number): LinqIterable<TValue> {
        return new Linq(takeLastIterator(this, count));
    }
    skip(count: number): LinqIterable<TValue> {
        return new Linq(skipIterator(this, count));
    }
    skipWhile(condition: (item: TValue, index: number) => boolean): LinqIterable<TValue> {
        return new Linq(skipWhileIterator(this, condition));
    }
    skipLast(count: number): LinqIterable<TValue> {
        return new Linq(skipLastIterator(this, count));
    }
    distinct(comparer?: Equality<TValue>): LinqIterable<TValue> {
        return new Linq(distinctIterator(this, comparer));
    }
    ofType<TOutput extends TValue>(type: 'string'|'number'|'boolean'|'undefined'|'function'|'object'|'symbol'|((item: TValue) => item is TOutput)): LinqIterable<TOutput> {
        const filter = typeof type === 'function' ? type : (item: TValue) => typeof item === type;
        return new Linq<TOutput>(whereIterator<TValue>(this, filter) as Iterable<TOutput>);
    }
    ofClass<TOutput extends TValue>(type: { new (...args: any[]): TOutput, prototype: TOutput }): LinqIterable<TOutput> {
        const filter = (item: TValue) => item instanceof type;
        return new Linq<TOutput>(whereIterator<TValue>(this, filter) as Iterable<TOutput>);
    }
    groupBy<TKey>(keySelector: (item: TValue, index: number) => TKey): LinqIterable<IGrouping<TKey, TValue>>;
    groupBy<TKey, TElement>(keySelector: (item: TValue, index: number) => TKey, elementSelector: (item: TValue, index: number) => TElement): LinqIterable<IGrouping<TKey, TElement>>;
    groupBy<TKey, TElement, TResult>(keySelector: (item: TValue, index: number) => TKey, elementSelector: (item: TValue, index: number) => TElement, resultCreator: (key: TKey, items: Iterable<TElement>) => TResult): LinqIterable<TResult>;
    groupBy<TKey, TElement, TResult>(keySelector: (item: TValue, index: number) => TKey,
                                     elementSelector?: (item: TValue, index: number) => TElement,
                                     resultCreator?: (key: TKey, items: Iterable<TElement>) => TResult): LinqIterable<IGrouping<TKey, TValue> | IGrouping<TKey, TElement> | TResult> {
        return new Linq(groupByIterator(this, keySelector, elementSelector, resultCreator));
    }
    orderBy<TKey>(keySelector: (item: TValue) => TKey, comparer?: Comparer<TKey>): LinqIterable<TValue> {
        return new Linq(sortAscendingIterator(this, keySelector, comparer));
    }
    orderByDescending<TKey>(keySelector: (item: TValue) => TKey, comparer?: Comparer<TKey>): LinqIterable<TValue> {
        return new Linq(sortDescendingIterator(this, keySelector, comparer));
    }
    concat(secondIterable: Iterable<TValue>): LinqIterable<TValue> {
        return new Linq(concatIterator(this, secondIterable));
    }
    union(secondIterable: Iterable<TValue>): LinqIterable<TValue> {
        return new Linq(unionIterator(this, secondIterable));
    }
    intersect(secondIterable: Iterable<TValue>): LinqIterable<TValue> {
        return new Linq(intersectIterator(this, secondIterable));
    }
    page(pageSize: number): LinqIterable<TValue[]> {
        return new Linq(pageIterator(this, pageSize));
    }
    reverse(): LinqIterable<TValue> {
        return new Linq(reverseIterator(this));
    }
    toArray(): TValue[];
    toArray<TResult>(map: Mapper<TValue, TResult>): TResult[];
    toArray<TResult>(map?: Mapper<TValue, TResult>): TValue[] | TResult[] {
        return toArrayCollector(this, map);
    }
    toMap<TKey>(keySelector: (item: TValue) => TKey): Map<TKey, TValue>;
    toMap<TKey, TElement>(keySelector: (item: TValue) => TKey, elementSelector: (item: TValue) => TElement): Map<TKey, TElement>;
    toMap<TKey, TElement>(keySelector: (item: TValue) => TKey, elementSelector?: (item: TValue) => TElement): Map<TKey, TValue|TElement> {
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
    aggregate<TResult=TValue>(accumulator: (result: TResult, item: TValue, index: number) => TResult, initial: TResult): TResult;
    aggregate<TResult=TValue>(accumulator: (result: TResult, item: TValue, index: number) => TResult, initial?: TResult): TResult | TValue | never {
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
    join(separator: string): string {
        return this.toArray().join(separator);
    }
    elementAt(index: number): TValue | undefined {
        return elementAtCollector(this, index);
    }
    forEach(action: Action<TValue>): void {
        return forEachCollector(this, action);
    }
    isEqual(iterable: Iterable<TValue>): boolean;
    isEqual<TSecond=TValue>(second: Iterable<TSecond>, comparer: (a: TValue, b: TSecond) => boolean): boolean;
    isEqual<TSecond=TValue>(second: Iterable<TSecond>, comparer?: (first: TValue, second: TSecond) => boolean): boolean {
        return sequenceEqual(this, second, comparer);
    }
    isElementsEqual(iterable: Iterable<TValue>): boolean;
    isElementsEqual<TSecond=TValue>(second: Iterable<TSecond>, comparer: (a: TValue, b: TSecond) => boolean): boolean;
    isElementsEqual<TSecond=TValue>(second: Iterable<TSecond>, comparer?: (first: TValue, second: TSecond) => boolean): boolean {
        return isElementsEqual(this, second, comparer);
    }
    [Symbol.iterator](): Iterator<TValue, any, any> {
        return this.#source[Symbol.iterator]();
    }
}

// let iterable = {} as LinqIterable<any>;
// iterable = {
    // where<T>(predicate: Predicate<T>): LinqIterable<T> {
    //     return whereIterator(this, predicate) as LinqIterable<T>;
    // },
    // select<T, R>(map: Mapper<T, R>): LinqIterable<R> {
    //     return selectIterator(this, map) as LinqIterable<R>;
    // },
    // selectMany(innerSelector, resultCreator) {
    //     const SelectManyIterable = import("./iterables/select-many.ts").SelectManyIterable;
    //     return new SelectManyIterable(this, innerSelector, resultCreator);
    // },
    // take(count) {
    //     return new TakeIterable(this, count);
    // },
    // takeWhile(condition) {
    //     return new TakeWhileIterable(this, condition);
    // },
    // takeLast(count) {
    //     return new TakeLastIterable(this, count);
    // },
    // skip(count) {
    //     return new SkipIterable(this, count);
    // },
    // skipWhile(condition) {
    //     return new SkipWhileIterable(this, condition);
    // },
    // skipLast(count) {
    //     return new SkipLastIterable(this, count);
    // },
    // distinct(comparer) {
    //     return new DistinctIterable(this, comparer);
    // },
    // ofType(type) {
    //     const WhereIterable = import("./iterables/where").WhereIterable;
    //     if (typeof type === 'string') {
    //         return new WhereIterable(this, function (item) {
    //             return typeof item === type;
    //         });
    //     } else {
    //         return new WhereIterable(this, type);
    //     }
    // },
    // ofClass(classType) {
    //     const WhereIterable = import("./iterables/where").WhereIterable;
    //     return new WhereIterable(this, function (item) {
    //         return item instanceof classType;
    //     });
    // },
    // groupBy(keySelector, elementSelector, resultCreator) {
    //     return new GroupIterable(this, keySelector, elementSelector, resultCreator);
    // },
    // orderBy(keySelector, comparer) {
    //     return new OrderIterable(this, keySelector, comparer);
    // },
    // orderByDescending(keySelector, comparer) {
    //     return new OrderIterableDescending(this, keySelector, comparer);
    // },
    // groupJoin(joinIterable, sourceKeySelector, joinIterableKeySelector, resultCreator) {
    //     return new GroupJoinIterable(this, joinIterable, sourceKeySelector, joinIterableKeySelector, resultCreator);
    // },
    // join(joinIterable, sourceKeySelector, joinIterableKeySelector, resultCreator) {
    //     if (arguments.length === 1) {
    //         return this.select(_ => '' + _).toArray().join(/*separator*/joinIterable); // join items of sequence in string. here joinIterable === separator
    //     }
    //     return new JoinIterable(this, joinIterable, sourceKeySelector, joinIterableKeySelector, resultCreator);
    // },
    // concat(secondIterable) {
    //     return new ConcatIterable(this, secondIterable);
    // },
    // union(secondIterable) {
    //     return new UnionIterable(this, secondIterable);
    // },
    // intersect(secondIterable, comparer) {
    //     return new IntersectIterable(this, secondIterable, comparer);
    // },
    // page(pageSize) {
    //     return new PageIterable(this, pageSize);
    // },
    // reverse() {
    //     return new ReverseIterable(this);
    // },
    // toArray<T, R>(map?: Mapper<T, R>): T[] | R[] {
    //     return ToArrayFinalizer.get<T, R>(this as any, map);
    // },
    // toMap(keySelector, valueSelector) {
    //     const transformValue = typeof valueSelector === 'undefined';
    //     return new Map(this.select(_ => [
    //         keySelector(_),
    //         transformValue ? _ : valueSelector(_)
    //     ])
    //     );
    // },
    // toSet() {
    //     return new Set(this.get());
    // },
    // first(predicate) {
    //     return FirstFinalizer.get(this, predicate);
    // },
    // firstOrDefault(def, predicate) {
    //     return FirstFinalizer.getOrDefault(this, def, predicate);
    // },
    // firstOrThrow(predicate) {
    //     return FirstFinalizer.getOrThrow(this, predicate);
    // },
    // firstIndex(predicate) {
    //     return FirstFinalizer.firstIndex(this, predicate);
    // },
    // last(predicate) {
    //     return LastFinalizer.get(this, predicate);
    // },
    // lastOrDefault(def, predicate) {
    //     return LastFinalizer.getOrDefault(this, def, predicate);
    // },
    // lastOrThrow(predicate) {
    //     return LastFinalizer.getOrThrow(this, predicate);
    // },
    // lastIndex(predicate) {
    //     return LastFinalizer.lastIndex(this, predicate);
    // },
    // single(predicate) {
    //     return SingleFinalizer.get(this, predicate);
    // },
    // singleOrDefault(def, predicate) {
    //     return SingleFinalizer.getOrDefault(this, def, predicate);
    // },
    // all(predicate) {
    //     return AllFinalizer.get(this, predicate)
    // },
    // allAndEvery(predicate) {
    //     return AllFinalizer.getAllAndEvery(this, predicate)
    // },
    // any(predicate) {
    //     return AnyFinalizer.get(this, predicate)
    // },
    // count(predicate) {
    //     return CountFinalizer.get(this, predicate);
    // },
    // aggregate(accumulator, initial) {
    //     switch (arguments.length) {
    //         case 1: {
    //             return AggregateFinalizer.get(this, accumulator);
    //         }
    //         case 2: {
    //             // here the resultCreator actually is the initial
    //             return AggregateFinalizer.getWithInitial(this, accumulator, initial);
    //         }
    //         default: {
    //             throw new RangeError('invalid arguments');
    //         }
    //     }
    // },
    // sum() {
    //     return AggregateFinalizer.get(this, (r, i) => r + i);
    // },
    // product() {
    //     return AggregateFinalizer.get(this, (r, i) => r * i);
    // },
    // min(comparer) {
    //     const compare = typeof comparer === 'undefined' ? defaultSortComparer : comparer;
    //     return AggregateFinalizer.get(this, (a, b) => {
    //         const comp = compare(a, b);
    //         return comp < 0 ? a : (comp > 0 ? b : a);
    //     });
    // },
    // max(comparer) {
    //     const compare = typeof comparer === 'undefined' ? defaultSortComparer : comparer;
    //     return AggregateFinalizer.get(this, (a, b) => {
    //         const comp = compare(a, b);
    //         return comp < 0 ? b : (comp > 0 ? a : b);
    //     });
    // },
    // elementAt(index) {
    //     return ElementAtFinalizer.get(this, index);
    // },
    // forEach(action) {
    //     return ForEachFinalizer.get(this, action);
    // },
    // isEqual(iterable, comparer) {
    //     return EqualFinalizer.get(this, iterable, comparer);
    // },
    // isElementsEqual(iterable, comparer) {
    //     return EqualFinalizer.getDifferentPosition(this, iterable, comparer);
    // }
// };

export default Linq;
