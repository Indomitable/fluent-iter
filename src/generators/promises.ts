import {createAsyncIterable} from "../utils.ts";

export function fromPromisesIterable<T = any>(
    ...promises: Promise<T>[]
): AsyncIterable<PromiseSettledResult<T>> {
    return createAsyncIterable(() => fromPromisesGenerator(...promises));
}

type IndexedPromiseSettledResult<T> = PromiseSettledResult<T> & { index: number };
async function* fromPromisesGenerator<T = any>(
    ...promises: Promise<T>[]
): AsyncGenerator<PromiseSettledResult<T>> {
    const pending = new Map<number, Promise<IndexedPromiseSettledResult<T>>>(
        promises.map((p, index) => [
            index,
            p.then(
                (value) => ({ index, status: 'fulfilled', value }),
                (reason) => ({ index, status: 'rejected', reason })
            ),
        ])
    );

    while (pending.size > 0) {
        const result = await Promise.race(pending.values());
        pending.delete(result.index);
        yield result;
    }
}

export function isFulfilled<T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> {
    return result.status === 'fulfilled';
}

export function isRejected<T>(result: PromiseSettledResult<T>): result is PromiseRejectedResult {
    return result.status === 'rejected';
}
