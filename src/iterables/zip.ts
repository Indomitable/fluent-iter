// combines two iterables
import {isFulfilled} from "../generators/promises.ts";

export function zipIterable<TThis, TOuter>(first: Iterable<TThis>, second: Iterable<TOuter>): Iterable<[TThis, TOuter]> {
    return {
        [Symbol.iterator]: function* () {
            const firstIterator = first[Symbol.iterator]();
            const secondIterator = second[Symbol.iterator]();
            while (true) {
                const firstResult = firstIterator.next();
                const secondResult = secondIterator.next();
                if (firstResult.done || secondResult.done) {
                    break;
                }
                yield [firstResult.value, secondResult.value];
            }
        }
    }
}

export function zipAsyncIterable<TThis, TOuter>(first: AsyncIterable<TThis>, second: AsyncIterable<TOuter>): AsyncIterable<[TThis, TOuter]> {
    return {
        [Symbol.asyncIterator]: async function* () {
            const firstIterator = first[Symbol.asyncIterator]();
            const secondIterator = second[Symbol.asyncIterator]();
            while (true) {
                const [first, second] = await Promise.allSettled([firstIterator.next(), secondIterator.next()]);
                if (isFulfilled(first) && isFulfilled(second) && !first.value.done && !second.value.done) {
                    yield [first.value.value, second.value.value];
                } else {
                    break;
                }
            }
        }
    }
}
