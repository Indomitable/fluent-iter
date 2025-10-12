import { getIterator } from "../../utils";

export default class IterableIterable<T> {
    #source: Iterable<T>;
    constructor(source: Iterable<T>) {
        this.#source = source;
    }

    [Symbol.iterator]() {
        return getIterator(this.#source);
    }

    get(): IterableIterable<T> {
        return this;
    }
}
