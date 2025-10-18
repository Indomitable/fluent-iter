/**
 * Take last N elements
 */
import {createIterable} from "../utils.ts";

export default function takeLastIterator<TValue>(input: Iterable<TValue>, count: number): Iterable<TValue> {
    return createIterable(() => takeLastGenerator(input, count));
}

function* takeLastGenerator<TValue>(input: Iterable<TValue>, count: number): Generator<TValue> {
    const queue = new LimitedQueue<TValue>(count);
    for (const item of input) {
        queue.push(item);
    }
    yield* queue;
}

class LimitedQueue<TItem> implements Iterable<TItem> {
    readonly #container: TItem[];
    readonly #limit: number;
    constructor(limit: number) {
        this.#container = [];
        this.#limit = limit;
    }

    push(item: TItem) {
        this.#container.push(item);
        if (this.#container.length > this.#limit) {
            this.#container.shift();
        }
    }

    [Symbol.iterator]() {
        return this.#container[Symbol.iterator]();
    }
}
