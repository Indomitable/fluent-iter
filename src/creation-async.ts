import type { FluentAsyncIterable, FluentAsyncIterablePromise } from 'fluent-iter';
import FluentAsync, {FluentAsyncPromise} from "./fluent-async.js";
import fromEventAsync from "./generators/from-event.ts";
import fromTimerAsync from "./generators/from-timer.js";
import {fromPromisesIterable} from "./generators/promises.ts";

export function fromEvent<TTarget extends EventTarget, TEvent extends keyof HTMLElementEventMap>(target: TTarget, event: TEvent): FluentAsyncIterable<HTMLElementEventMap[TEvent]> {
    return new FluentAsync(fromEventAsync(target, event));
}

export function fromTimer(interval: number, delay?: number): FluentAsyncIterable<number> {
    return new FluentAsync(fromTimerAsync(interval, delay));
}

export function fromPromises<T>(
    ...promises: Promise<T>[]
): FluentAsyncIterablePromise<T> {
    return new FluentAsyncPromise(fromPromisesIterable(...promises));
}
