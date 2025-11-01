import type { FluentIterableAsync, FluentIterableAsyncPromise } from 'fluent-iter';
import FluentAsync, {FluentAsyncPromise} from "./fluent-async.js";
import fromEventAsync from "./generators/from-event.ts";
import fromTimerAsync from "./generators/from-timer.js";
import {fromPromisesIterable} from "./generators/promises.ts";

export function fromEvent<TTarget extends EventTarget, TEvent extends keyof HTMLElementEventMap>(target: TTarget, event: TEvent): FluentIterableAsync<HTMLElementEventMap[TEvent]> {
    return new FluentAsync(fromEventAsync(target, event));
}

export function fromTimer(interval: number, delay?: number): FluentIterableAsync<number> {
    return new FluentAsync(fromTimerAsync(interval, delay));
}

export function fromPromises<T>(
    ...promises: Promise<T>[]
): FluentIterableAsyncPromise<T> {
    return new FluentAsyncPromise(fromPromisesIterable(...promises));
}
