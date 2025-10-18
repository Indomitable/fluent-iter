import { FluentIterable } from './fluent-iterable.ts';
import Fluent from "./fluent.ts";
import arrayLikeIterator from "./iterables/initial/array-like.ts";
import objectIterator from "./iterables/initial/object.ts";
import rangeIterable from "./generators/range.ts";
import repeatIterable from "./generators/repeat.ts";

export function fromIterable<TValue>(iterable: Iterable<TValue>): FluentIterable<TValue> {
    return new Fluent<TValue>(iterable);
}

export function fromObject<TValue extends {}, TKey extends keyof TValue>(value: TValue): FluentIterable<{ key: string, value: TValue[TKey] }>;
export function fromObject<TValue extends {}, TKey extends keyof TValue, TResult>(value: TValue, resultCreator: (key: TKey, value: TValue[TKey]) => TResult): FluentIterable<TResult>;
export function fromObject<TValue extends {}, TKey extends keyof TValue, TResult>(value: TValue, resultCreator?: (key: TKey, value: TValue[TKey]) => TResult): FluentIterable<{ key: string, value: TValue[TKey] } | TResult> {
    return new Fluent(objectIterator<TValue, TKey, TResult>(value, resultCreator));
}

/**
 * The object which has property length of type number and keys with names: '0', '1' ...
 * @param {ArrayLike} arrayLike
 */
export function fromArrayLike<TValue>(arrayLike: ArrayLike<TValue>): FluentIterable<TValue> {
    return new Fluent(arrayLikeIterator(arrayLike));
}

export function range(from: number, to: number): FluentIterable<number> {
    return new Fluent(rangeIterable(from, to));
}

export function repeat<TValue>(value: TValue, times: number): FluentIterable<TValue> {
    return new Fluent(repeatIterable(value, times));
}

export function from<TValue>(iterable: Iterable<TValue> | ArrayLike<TValue>): FluentIterable<TValue>;
export function from<TValue extends {}, TKey extends keyof TValue>(value: TValue): FluentIterable<{ key: string, value: TValue[TKey] }>;
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
