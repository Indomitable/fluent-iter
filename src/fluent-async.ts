import type { FluentIterableAsync } from 'fluent-iter';
import type {Mapper, Predicate} from "./interfaces.js";
import {whereAsyncIterator} from "./iterables/where.js";
import {selectIteratorAsync} from "./iterables/select.js";

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
    [Symbol.asyncIterator](): AsyncIterator<TValue> {
        return this.#source[Symbol.asyncIterator]();
    }
}
