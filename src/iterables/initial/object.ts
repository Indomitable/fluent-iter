import {doneValue, iteratorResultCreator} from "../../utils.ts";

export default function objectIterator<TValue extends {}, TKey extends keyof TValue, TResult>(source: TValue, resultCreator?: (key: TKey, value: TValue[TKey]) => TResult): Iterable<{ key: string, value: TValue[TKey] } | TResult> {
    return new ObjectIterable(source, resultCreator);
    // if (!resultCreator) {
    //     return Object.entries(source).map(([key, value]) => ({key, value}));
    // } else {
    //     return Object.entries(source).map(([key, value]) => resultCreator(key as TKey, value as TValue[TKey]));
    // }
}

class ObjectIterable<TValue extends object, TKey extends keyof TValue, TResult> implements Iterable<TResult> {
    readonly #source: TValue;
    readonly #resultCreator: (key: TKey, value: TValue[TKey]) => TResult;
    constructor(source: TValue, resultCreator?: (key: TKey, value: TValue[TKey]) => TResult) {
        this.#source = source;
        this.#resultCreator = resultCreator ?? ObjectIterable.__defaultResultCreator<TKey, TValue, TResult>;
    }

    static __defaultResultCreator<TKey extends keyof TValue, TValue, TResult>(key: TKey, value: TValue[TKey]): TResult {
        return { key, value } as TResult;
    }

    [Symbol.iterator]() {
        const obj = this.#source;
        const resultCreator = this.#resultCreator;
        const keys = Object.keys(obj) as TKey[];
        let index = 0;
        return {
            next() {
                if (index < keys.length) {
                    const key = keys[index];
                    const value = obj[key];
                    index++;
                    return iteratorResultCreator(resultCreator(key, value));
                } else {
                    return doneValue();
                }
            }
        };
    }
}
