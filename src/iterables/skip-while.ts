import {createIterable} from "../utils.ts";

/**
 * Return skip first elements until condition got falsy and return rest
 */
export function skipWhileIterator<TValue>(input: Iterable<TValue>, condition: (item: TValue, index: number) => boolean): Iterable<TValue> {
    return createIterable(() => skipWhileGenerator(input, condition));
}

function* skipWhileGenerator<TValue>(input: Iterable<TValue>, condition: (item: TValue, index: number) => boolean): Generator<TValue> {
    let flag = false;
    let index = 0;
    for (const item of input) {
        if (!flag && condition(item, index++)) {
            continue;
        } else {
            flag = true;
        }
        yield item;
    }
}

export function skipWhileAsyncIterator<TValue>(input: Iterable<TValue>, condition: (item: TValue, index: number) => boolean): AsyncIterable<TValue> {
    let flag = false;
    let index = 0;
    return {
        [Symbol.asyncIterator]: async function* (){
            for await (const item of input) {
                if (!flag && condition(item, index++)) {
                    continue;
                } else {
                    flag = true;
                }
                yield item;
            }
        }
    };
}
