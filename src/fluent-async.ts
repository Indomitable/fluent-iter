import type { FluentIterableAsync } from 'fluent-iter';
import type {Mapper, Predicate} from "./interfaces.js";
import {whereAsyncIterator} from "./iterables/where.js";
import {selectIteratorAsync} from "./iterables/select.js";
import takeIteratorAsync, {takeIterator} from "./iterables/take.js";
import {toArrayAsyncCollector} from "./finalizers/to-array.js";

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
    toArray(): Promise<TValue[]>;
    toArray<TResult>(map: Mapper<TValue, TResult>): Promise<TResult[]>;
    toArray<TResult>(map?: Mapper<TValue, TResult>): Promise<(TValue|TResult)[]> {
        return toArrayAsyncCollector(this, map);
    }
    [Symbol.asyncIterator](): AsyncIterator<TValue> {
        return this.#source[Symbol.asyncIterator]();
    }
}
