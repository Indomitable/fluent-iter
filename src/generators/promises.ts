import {FulfilledPromiseResult, PromiseResult, RejectedPromiseResult } from "fluent-iter";
import {createAsyncIterable} from "../utils.ts";

export function fromPromisesIterable<T = any>(
    ...promises: Promise<T>[]
): AsyncIterable<PromiseResult<T>> {
    return createAsyncIterable(() => fromPromisesGenerator(...promises));
}

async function* fromPromisesGenerator<T = any>(
    ...promises: Promise<T>[]
): AsyncGenerator<PromiseResult<T>> {
    const pending = new Map<number, Promise<PromiseResult<T>>>(
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

export function isFulfilled<T>(result: PromiseResult<T>): result is FulfilledPromiseResult<T> {
    return result.status === 'fulfilled';
}

export function isRejected<T>(result: PromiseResult<T>): result is RejectedPromiseResult {
    return result.status === 'rejected';
}
