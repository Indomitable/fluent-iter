import type {
    FluentIterable,
    FluentAsyncIterable,
    FluentAsyncIterablePromise,
    IGrouping,
    PromiseMap
} from 'fluent-iter';
import type {Mapper, Predicate} from "./interfaces.ts";
import {whereAsyncIterator} from "./iterables/where.ts";
import {selectAsyncIterator} from "./iterables/select.ts";
import takeAsyncIterator from "./iterables/take.ts";
import {toArrayAsyncCollector, toMapAsyncCollector} from "./finalizers/to-array.ts";
import {groupByAsyncIterator} from "./iterables/group.ts";
import {takeWhileAsyncIterator} from "./iterables/take-while.ts";
import {skipAsyncIterator} from "./iterables/skip.ts";
import {skipWhileAsyncIterator} from "./iterables/skip-while.ts";
import {distinctAsyncIterator} from "./iterables/set-iterators.ts";
import {pageAsyncIterator} from "./iterables/page.ts";
import {zipAsyncIterable} from "./iterables/zip.ts";
import {takeLastAsyncIterator} from "./iterables/take-last.ts";
import {skipLastAsyncIterator} from "./iterables/skip-last.ts";

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

    get filter() {
        return this.where;
    }

    select<TOutput>(map: Mapper<TValue, TOutput>): FluentAsyncIterable<TOutput> {
        return new FluentAsync(selectAsyncIterator(this, map));
    }

    get map() {
        return this.select;
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
        [TKey, TValue] extends ['fulfilled' | 'rejected', PromiseSettledResult<infer TPromiseValue>] ?
                FluentAsyncIterable< IGrouping<'fulfilled', PromiseFulfilledResult<TPromiseValue>> | IGrouping<'rejected', PromiseRejectedResult>>
            : FluentAsyncIterable<IGrouping<TKey, TValue>>;
    groupBy<TKey, TElement>(keySelector: (item: TValue, index: number) => TKey, elementSelector: (item: TValue, index: number) => TElement): FluentAsyncIterable<IGrouping<TKey, TElement>>;
    groupBy<TKey, TElement, TResult>(keySelector: (item: TValue, index: number) => TKey, elementSelector: (item: TValue, index: number) => TElement, resultCreator: (key: TKey, items: FluentIterable<TElement>) => TResult): FluentAsyncIterable<TResult>;
    groupBy<TKey, TElement, TResult>(keySelector: (item: TValue, index: number) => TKey,
                                     elementSelector?: (item: TValue, index: number) => TElement,
                                     resultCreator?: (key: TKey, items: FluentIterable<TElement>) => TResult): FluentAsyncIterable<IGrouping<TKey, TValue> | IGrouping<TKey, TElement> | TResult> {
        return new FluentAsync(groupByAsyncIterator(this, keySelector, elementSelector, resultCreator));
    }
    page(pageSize: number): FluentAsyncIterable<TValue[]> {
        return new FluentAsync(pageAsyncIterator(this, pageSize));
    }

    zip<TOuter>(second: AsyncIterable<TOuter>): FluentAsyncIterable<[TValue, TOuter]> {
        return new FluentAsync(zipAsyncIterable(this, second));
    }

    takeLast(count: number): FluentAsyncIterable<TValue> {
        return new FluentAsync(takeLastAsyncIterator(this, count));
    }

    skipLast(count: number): FluentAsyncIterable<TValue> {
        return new FluentAsync(skipLastAsyncIterator(this, count));
    }

    toArray(): Promise<TValue[]>;
    toArray<TResult>(map: Mapper<TValue, TResult>): Promise<TResult[]>;
    toArray<TResult>(map?: Mapper<TValue, TResult>): Promise<(TValue|TResult)[]> {
        return toArrayAsyncCollector(this, map);
    }

    toMap<TKey>(keySelector: (item: TValue) => TKey):
        [TKey, TValue] extends ['fulfilled' | 'rejected', IGrouping<'fulfilled', PromiseFulfilledResult<infer TPromiseValue>> | IGrouping<'rejected', PromiseRejectedResult>]
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

export class FluentAsyncPromise<T> extends FluentAsync<PromiseSettledResult<T>> implements FluentAsyncIterablePromise<T> {
    groupByStatus(): FluentAsyncIterable< IGrouping<'fulfilled', PromiseFulfilledResult<T>> | IGrouping<'rejected', PromiseRejectedResult>> {
        return super.groupBy(x => x.status) as FluentAsyncIterable< IGrouping<'fulfilled', PromiseFulfilledResult<T>> | IGrouping<'rejected', PromiseRejectedResult>>;
    }

    toStatusMap(): Promise<PromiseMap<T>> {
        return toMapAsyncCollector(this, p => p.status) as Promise<PromiseMap<T>>;
    }
}
