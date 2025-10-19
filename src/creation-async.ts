import type { FluentIterableAsync } from 'fluent-iter';
import FluentAsync from "./fluent-async.js";
import fromEventAsync from "./generators/from-event.ts";
import fromTimerAsync from "./generators/from-timer.js";

export function fromEvent<TTarget extends EventTarget, TEvent extends keyof HTMLElementEventMap>(target: TTarget, event: TEvent): FluentIterableAsync<HTMLElementEventMap[TEvent]> {
    return new FluentAsync(fromEventAsync(target, event));
}

export function fromTimer(interval: number, delay?: number): FluentIterableAsync<number> {
    return new FluentAsync(fromTimerAsync(interval, delay));
}
