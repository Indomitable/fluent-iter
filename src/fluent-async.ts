import type {
    FluentIterable,
    FluentAsyncIterable,
    FluentAsyncIterablePromise,
    FulfilledPromiseResult,
    IGrouping,
    PromiseMap,
    PromiseResult,
    RejectedPromiseResult
} from 'fluent-iter';
import type {Mapper, Predicate} from "./interfaces.js";
import {whereAsyncIterator} from "./iterables/where.js";
import {selectAsyncIterator} from "./iterables/select.js";
import takeAsyncIterator from "./iterables/take.js";
import {toArrayAsyncCollector, toMapAsyncCollector} from "./finalizers/to-array.js";
import {groupByAsyncIterator} from "./iterables/group.ts";
import {takeWhileAsyncIterator} from "./iterables/take-while.ts";
import {skipAsyncIterator} from "./iterables/skip.ts";
import {skipWhileAsyncIterator} from "./iterables/skip-while.ts";
import {distinctAsyncIterator} from "./iterables/set-iterators.ts";

export default class FluentAsync<TValue> implements FluentAsyncIterable<TValue> {
    readonly #source: AsyncIterable<TValue>;

    constructor(source: AsyncIterable<TValue>) {
        this.#source = source;
    }

    where<TSubValue extends TValue>(predicate: (item: TValue) => item is TSubValue): FluentAsyncIterable<TSubValue>;
    where(predicate: Predicate<TValue>): FluentAsyncIterable<TValue>;
    where<TSubValue>(predicate: Predicate<TValue>): FluentAsyncIterable<TValue> | FluentAsyncIterable<TSubValue> {
        return new FluentAsync(whereAsyncIterator(this, predicate));
    }
    select<TOutput>(map: Mapper<TValue, TOutput>): FluentAsyncIterable<TOutput> {
        return new FluentAsync(selectAsyncIterator(this, map));
    }
    take(count: number): FluentAsyncIterable<TValue> {
        return new FluentAsync(takeAsyncIterator(this, count));
    }
    takeWhile(condition: (item: TValue, index: number) => boolean): FluentAsyncIterable<TValue> {
        return new FluentAsync(takeWhileAsyncIterator(this, condition));
    }
    skip(count: number): FluentAsyncIterable<TValue> {
        return new FluentAsync(skipAsyncIterator(this, count));
    }
    skipWhile(condition: (item: TValue, index: number) => boolean): FluentAsyncIterable<TValue> {
        return new FluentAsync(skipWhileAsyncIterator(this, condition));
    }
    distinct<TKey>(keySelector?: (item: TValue) => TKey): FluentAsyncIterable<TValue> {
        return new FluentAsync(distinctAsyncIterator(this, keySelector));
    }
    groupBy<TKey>(keySelector: (item: TValue, index: number) => TKey):
        [TKey, TValue] extends ['fulfilled' | 'rejected', PromiseResult<infer TPromiseValue>] ?
                FluentAsyncIterable< IGrouping<'fulfilled', FulfilledPromiseResult<TPromiseValue>> | IGrouping<'rejected', RejectedPromiseResult>>
            : FluentAsyncIterable<IGrouping<TKey, TValue>>;
    groupBy<TKey, TElement>(keySelector: (item: TValue, index: number) => TKey, elementSelector: (item: TValue, index: number) => TElement): FluentAsyncIterable<IGrouping<TKey, TElement>>;
    groupBy<TKey, TElement, TResult>(keySelector: (item: TValue, index: number) => TKey, elementSelector: (item: TValue, index: number) => TElement, resultCreator: (key: TKey, items: FluentIterable<TElement>) => TResult): FluentAsyncIterable<TResult>;
    groupBy<TKey, TElement, TResult>(keySelector: (item: TValue, index: number) => TKey,
                                     elementSelector?: (item: TValue, index: number) => TElement,
                                     resultCreator?: (key: TKey, items: FluentIterable<TElement>) => TResult): FluentAsyncIterable<IGrouping<TKey, TValue> | IGrouping<TKey, TElement> | TResult> {
        return new FluentAsync(groupByAsyncIterator(this, keySelector, elementSelector, resultCreator));
    }
    toArray(): Promise<TValue[]>;
    toArray<TResult>(map: Mapper<TValue, TResult>): Promise<TResult[]>;
    toArray<TResult>(map?: Mapper<TValue, TResult>): Promise<(TValue|TResult)[]> {
        return toArrayAsyncCollector(this, map);
    }

    toMap<TKey>(keySelector: (item: TValue) => TKey):
        [TKey, TValue] extends ['fulfilled' | 'rejected', IGrouping<'fulfilled', FulfilledPromiseResult<infer TPromiseValue>> | IGrouping<'rejected', RejectedPromiseResult>]
            ? Promise<PromiseMap<TPromiseValue>>
            : Promise<Map<TKey, TValue>>;
    toMap<TKey, TElement>(keySelector: (item: TValue) => TKey, elementSelector: (item: TValue) => TElement): Promise<Map<TKey, TElement>>;
    toMap<TKey, TElement>(keySelector: (item: TValue) => TKey, elementSelector?: (item: TValue) => TElement): Promise<Map<TKey, TValue|TElement>> {
        return toMapAsyncCollector(this, keySelector, elementSelector);
    }

    [Symbol.asyncIterator](): AsyncIterator<TValue> {
        return this.#source[Symbol.asyncIterator]();
    }
}

export class FluentAsyncPromise<T> extends FluentAsync<PromiseResult<T>> implements FluentAsyncIterablePromise<T> {
    groupByStatus(): FluentAsyncIterable< IGrouping<'fulfilled', FulfilledPromiseResult<T>> | IGrouping<'rejected', RejectedPromiseResult>> {
        return super.groupBy(x => x.status) as FluentAsyncIterable< IGrouping<'fulfilled', FulfilledPromiseResult<T>> | IGrouping<'rejected', RejectedPromiseResult>>;
    }

    toStatusMap(): Promise<PromiseMap<T>> {
        return toMapAsyncCollector(this, p => p.status) as Promise<PromiseMap<T>>;
    }
}
