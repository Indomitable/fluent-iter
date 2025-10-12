import RangeIterable from './generators/range';
import RepeatIterable from './generators/repeat';
import ArrayIterable from './iterables/initial/array';
import ArrayLikeIterable from './iterables/initial/array-like';
import ObjectIterable from './iterables/initial/object';
import IterableIterable from './iterables/initial/iterable';
import { LinqIterable } from './linq-iterable';

export function fromIterable<TValue>(iterable: Iterable<TValue>): LinqIterable<TValue> {
    return Array.isArray(iterable)
        ? new ArrayIterable(iterable) as unknown as LinqIterable<TValue>
        : new IterableIterable(iterable) as unknown as LinqIterable<TValue>;
}

export function fromObject<TValue extends {}, TKey extends keyof TValue>(value: TValue): LinqIterable<{ key: string, value: TValue[TKey] }>;
export function fromObject<TValue extends {}, TKey extends keyof TValue, TResult>(value: TValue, resultCreator: (key: TKey, value: TValue[TKey]) => TResult): LinqIterable<TResult>;
export function fromObject<TValue extends {}, TKey extends keyof TValue, TResult>(value: TValue, resultCreator?: (key: TKey, value: TValue[TKey]) => TResult): LinqIterable<TResult> {
    return new ObjectIterable(value, resultCreator) as unknown as LinqIterable<TResult>;
}

/**
 * The object which has property length of type number and keys with names: '0', '1' ...
 * @param {ArrayLike} arrayLike
 */
export function fromArrayLike<TValue>(arrayLike: ArrayLike<TValue>): LinqIterable<TValue> {
    return new ArrayLikeIterable(arrayLike) as unknown as LinqIterable<TValue>;
}

export function range(from: number, to: number): LinqIterable<number> {
    return new RangeIterable(from, to) as unknown as LinqIterable<number>;
}

export function repeat<TValue>(value: TValue, times: number): LinqIterable<TValue> {
    return new RepeatIterable(value, times) as unknown as LinqIterable<TValue>;
}

export function from<TValue>(iterable: Iterable<TValue> | ArrayLike<TValue>): LinqIterable<TValue>;
export function from<TValue extends {}, TKey extends keyof TValue>(value: TValue): LinqIterable<{ key: string, value: TValue[TKey] }>;
export function from<TValue>(source: Iterable<TValue> | ArrayLike<TValue> | TValue) {
    if (isIterable(source)) {
        return fromIterable(source);
    }
    if (isArrayLike(source)) {
        return fromArrayLike(source);
    }
    return fromObject(source as object);
}

function isIterable<T>(o: any): o is Iterable<T> {
    const iterator = o[Symbol.iterator];
    return typeof iterator === 'function';
}

function isArrayLike<T>(o: any): o is ArrayLike<T> {
    return 'length' in o;
}
