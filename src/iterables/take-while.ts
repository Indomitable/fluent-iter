import {createIterable} from "../utils.ts";

/**
 * Return items until certain condition got falsy
 */
export function takeWhileIterator<TValue>(input: Iterable<TValue>, condition: (item: TValue, index: number) => boolean): Iterable<TValue> {
    return createIterable(() => takeWhileGenerator(input, condition));
}

function* takeWhileGenerator<TValue>(input: Iterable<TValue>, condition: (item: TValue, index: number) => boolean): Generator<TValue> {
    let index = 0;
    for (const item of input) {
        if (condition(item, index++)) {
            yield item;
        } else {
            break;
        }
    }
}

export function takeWhileAsyncIterator<TValue>(input: AsyncIterable<TValue>, condition: (item: TValue, index: number) => boolean): AsyncIterable<TValue> {
    return {
        [Symbol.asyncIterator]: async function* (){
            let index = 0;
            for await (const item of input) {
                if (condition(item, index++)) {
                    yield item;
                } else {
                    break;
                }
            }
        }
    };
}
