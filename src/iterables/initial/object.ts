import { doneValue, iteratorResultCreator } from "../../utils";

export default class ObjectIterable<TValue extends object, TKey extends keyof TValue, TResult> {
    #source: TValue;
    #resultCreator: (key: TKey, value: TValue[TKey]) => TResult;
    constructor(source: TValue, resultCreator?: (key: TKey, value: TValue[TKey]) => TResult) {
        this.#source = source;
        this.#resultCreator = typeof resultCreator === 'undefined' ? ObjectIterable.__defaultResultCreator<TKey, TValue, TResult> : resultCreator;
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

    get() {
        return this;
    }
}
