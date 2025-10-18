import {createIterable} from "../utils.ts";

/**
 * Return skip first elements until condition got falsy and return rest
 */
export default function skipWhileIterator<TValue>(input: Iterable<TValue>, condition: (item: TValue, index: number) => boolean): Iterable<TValue> {
    return createIterable(() => skipWhileGenerator(input, condition));
}

function* skipWhileGenerator<TValue>(input: Iterable<TValue>, condition: (item: TValue, index: number) => boolean): Generator<TValue> {
    let flag = false;
    let index = 0;
    for (const item of input) {
        if (condition(item, index++) && !flag) {
            continue;
        } else {
            flag = true;
        }
        yield item;
    }
}
