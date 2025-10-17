import {IterableGenerator} from "../utils.ts";

/**
 * Return items until certain condition got falsy
 */
export default function takeWhileIterator<TValue>(input: Iterable<TValue>, condition: (item: TValue, index: number) => boolean): Iterable<TValue> {
    return new IterableGenerator(() => takeWhileGenerator(input, condition));
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
