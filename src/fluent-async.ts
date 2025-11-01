import type {
    FluentIterable,
    FluentIterableAsync,
    FluentIterableAsyncPromise,
    FulfilledPromiseResult,
    IGrouping,
    PromiseMap,
    PromiseResult,
    RejectedPromiseResult
} from 'fluent-iter';
import type {Mapper, Predicate} from "./interfaces.js";
import {whereAsyncIterator} from "./iterables/where.js";
import {selectIteratorAsync} from "./iterables/select.js";
import takeIteratorAsync from "./iterables/take.js";
import {toArrayAsyncCollector, toMapAsyncCollector} from "./finalizers/to-array.js";
import {groupByAsyncIterator} from "./iterables/group.ts";

export default class FluentAsync<TValue> implements FluentIterableAsync<TValue> {
    readonly #source: AsyncIterable<TValue>;

    constructor(source: AsyncIterable<TValue>) {
        this.#source = source;
    }

    where<TSubValue extends TValue>(predicate: (item: TValue) => item is TSubValue): FluentIterableAsync<TSubValue>;
    where(predicate: Predicate<TValue>): FluentIterableAsync<TValue>;
    where<TSubValue>(predicate: Predicate<TValue>): FluentIterableAsync<TValue> | FluentIterableAsync<TSubValue> {
        return new FluentAsync(whereAsyncIterator(this, predicate));
    }
    select<TOutput>(map: Mapper<TValue, TOutput>): FluentIterableAsync<TOutput> {
        return new FluentAsync(selectIteratorAsync(this, map));
    }
    take(count: number): FluentIterableAsync<TValue> {
        return new FluentAsync(takeIteratorAsync(this, count));
    }
    groupBy<TKey>(keySelector: (item: TValue, index: number) => TKey):
        [TKey, TValue] extends ['fulfilled' | 'rejected', PromiseResult<infer TPromiseValue>] ?
                FluentIterableAsync< IGrouping<'fulfilled', FulfilledPromiseResult<TPromiseValue>> | IGrouping<'rejected', RejectedPromiseResult>>
            : FluentIterableAsync<IGrouping<TKey, TValue>>;
    groupBy<TKey, TElement>(keySelector: (item: TValue, index: number) => TKey, elementSelector: (item: TValue, index: number) => TElement): FluentIterableAsync<IGrouping<TKey, TElement>>;
    groupBy<TKey, TElement, TResult>(keySelector: (item: TValue, index: number) => TKey, elementSelector: (item: TValue, index: number) => TElement, resultCreator: (key: TKey, items: FluentIterable<TElement>) => TResult): FluentIterableAsync<TResult>;
    groupBy<TKey, TElement, TResult>(keySelector: (item: TValue, index: number) => TKey,
                                     elementSelector?: (item: TValue, index: number) => TElement,
                                     resultCreator?: (key: TKey, items: FluentIterable<TElement>) => TResult): FluentIterableAsync<IGrouping<TKey, TValue> | IGrouping<TKey, TElement> | TResult> {
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

export class FluentAsyncPromise<T> extends FluentAsync<PromiseResult<T>> implements FluentIterableAsyncPromise<T> {
    groupByStatus(): FluentIterableAsync< IGrouping<'fulfilled', FulfilledPromiseResult<T>> | IGrouping<'rejected', RejectedPromiseResult>> {
        return super.groupBy(x => x.status) as FluentIterableAsync< IGrouping<'fulfilled', FulfilledPromiseResult<T>> | IGrouping<'rejected', RejectedPromiseResult>>;
    }

    toStatusMap(): Promise<PromiseMap<T>> {
        return toMapAsyncCollector(this, p => p.status) as Promise<PromiseMap<T>>;
    }
}
