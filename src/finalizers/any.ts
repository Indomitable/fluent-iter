import { getIterator } from "../utils.ts";
import {Predicate} from "../interfaces.ts";

export default function anyCollector<TValue>(source: Iterable<TValue>, predicate?: Predicate<TValue>): boolean {
    if (!predicate) {
        const iterator = getIterator(source);
        return !iterator.next().done;
    } else {
        for (const item of source) {
            if (predicate(item)) {
                return true;
            }
        }
        return false;
    }
}
