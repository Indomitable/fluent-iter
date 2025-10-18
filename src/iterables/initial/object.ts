export default function objectIterator<TValue extends {}, TKey extends keyof TValue, TResult>(source: TValue, resultCreator?: (key: TKey, value: TValue[TKey]) => TResult): Iterable<{ key: string, value: TValue[TKey] } | TResult> {
    const resultMaker = resultCreator ?? ((key: TKey, value: TValue[TKey]) => ({ key, value } as TResult));
    const keys = Object.keys(source) as TKey[];
    return {
        [Symbol.iterator]: function* () {
            for (const key of keys) {
                yield resultMaker(key, source[key]);
            }
        }
    };
}
