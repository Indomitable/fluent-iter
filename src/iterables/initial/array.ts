import { getIterator } from "../../utils";
import { ArrayFilterIterable } from "../where";
import { ToArrayArrayFinalizer } from "../../finalizers/to-array";

export default class ArrayIterable<T> {
    #array: T[]
    constructor(array: T[]) {
        this.#array = array;
    }

    [Symbol.iterator]() {
        return getIterator(this.#array);
    }

    get(): T[] {
        return this.#array;
    }

    where(predicate: (e: T) => boolean) {
        return new ArrayFilterIterable(this.#array, predicate);
    }

    toArray<R>(mapper: (e: T) => R): R[] {
        return ToArrayArrayFinalizer.get<T, R>(this, mapper);
    }
}
