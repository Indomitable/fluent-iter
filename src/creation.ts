import { LinqIterable } from './linq-iterable.ts';
import Linq from "./linq-mixin.ts";
import rangeGenerator from "./generators/range.ts";
import repeatGenerator from "./generators/repeat.ts";
import arrayLikeIterator from "./iterables/initial/array-like.ts";
import objectIterator from "./iterables/initial/object.ts";
import {IterableGenerator} from "./utils.ts";

export function fromIterable<TValue>(iterable: Iterable<TValue>): LinqIterable<TValue> {
    return new Linq<TValue>(iterable);
}

export function fromObject<TValue extends {}, TKey extends keyof TValue>(value: TValue): LinqIterable<{ key: string, value: TValue[TKey] }>;
export function fromObject<TValue extends {}, TKey extends keyof TValue, TResult>(value: TValue, resultCreator: (key: TKey, value: TValue[TKey]) => TResult): LinqIterable<TResult>;
export function fromObject<TValue extends {}, TKey extends keyof TValue, TResult>(value: TValue, resultCreator?: (key: TKey, value: TValue[TKey]) => TResult): LinqIterable<{ key: string, value: TValue[TKey] } | TResult> {
    return new Linq(objectIterator<TValue, TKey, TResult>(value, resultCreator));
}

/**
 * The object which has property length of type number and keys with names: '0', '1' ...
 * @param {ArrayLike} arrayLike
 */
export function fromArrayLike<TValue>(arrayLike: ArrayLike<TValue>): LinqIterable<TValue> {
    return new Linq(arrayLikeIterator(arrayLike));
}

export function range(from: number, to: number): LinqIterable<number> {
    return new Linq(new IterableGenerator(() => rangeGenerator(from, to)));
}

export function repeat<TValue>(value: TValue, times: number): LinqIterable<TValue> {
    return new Linq(repeatGenerator(value, times));
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
