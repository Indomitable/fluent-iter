import whereIterator from "./iterables/where.ts";
import selectIterator from "./iterables/select.ts";
import selectManyIterator from "./iterables/select-many.ts";
// import { FirstFinalizer } from "./finalizers/first.js";
// import { SingleFinalizer } from "./finalizers/single.js";
import takeIterator from "./iterables/take.ts";
import skipIterator from "./iterables/skip.ts";
// import { AllFinalizer } from "./finalizers/all.js";
// import { AnyFinalizer } from "./finalizers/any.js";
// import { DistinctIterable } from "./iterables/distinct.js";
// import { GroupIterable } from "./iterables/group.js";
// import { CountFinalizer } from "./finalizers/count.js";
// import { AggregateFinalizer } from "./finalizers/aggregate.js";
// import { OrderIterable, OrderIterableDescending } from "./iterables/order.js";
// import { ConcatIterable } from "./iterables/concat.js";
// import { ForEachFinalizer } from "./finalizers/for-each.js";
// import { ElementAtFinalizer } from "./finalizers/element-at.js";
import { toArrayCollector } from "./finalizers/to-array.ts";
// import { UnionIterable } from "./iterables/union.js";
// import { GroupJoinIterable } from "./iterables/group-join.js";
// import { JoinIterable } from "./iterables/join.js";
// import { EqualFinalizer } from "./finalizers/equal.js";
// import { PageIterable } from "./iterables/page.js";
// import { defaultSortComparer } from "./utils.js";
// import { ReverseIterable } from "./iterables/reverse.js";
import takeWhileIterator from "./iterables/take-while.ts";
import skipWhileIterator from "./iterables/skip-while.ts";
import takeLastIterator from "./iterables/take-last.ts";
// import { SkipLastIterable } from "./iterables/skip-last.js";
// import { LastFinalizer } from "./finalizers/last.js";
// import { IntersectIterable } from "./iterables/intersect.js";

import {Equality, Mapper, Predicate} from "./interfaces.ts";
import type { LinqIterable } from "./linq-iterable.ts";
import skipLastIterator from "./iterables/skip-last.js";
import distinctIterator from "./iterables/distinct.js";


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
    toArray(): TValue[];
    toArray<TResult>(map: Mapper<TValue, TResult>): TResult[];
    toArray<TResult>(map?: Mapper<TValue, TResult>): TValue[] | TResult[] {
        return toArrayCollector(this, map);
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
