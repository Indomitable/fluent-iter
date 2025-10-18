import {getIterator} from "../utils.ts";

export default function aggregateCollector<TValue, TAccumulate>(source: Iterable<TValue>, accumulator: (acc: TAccumulate, item: TValue, index: number) => TAccumulate, initial?: TAccumulate): TAccumulate {
    let res: TAccumulate;
    const iterator = getIterator(source);
    let index = 0;
    if (typeof initial !== 'undefined') {
        res = initial;
    } else {
        const first = iterator.next();
        if (first.done) {
            throw new TypeError('No items in sequence');
        }
        res = first.value as any as TAccumulate;
        index++;
    }
    let item = iterator.next();
    while (!item.done) {
        res = accumulator(res, item.value, index++);
        item = iterator.next();
    }
    return res;
}
