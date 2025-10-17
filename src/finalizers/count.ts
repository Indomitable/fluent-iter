import type {Predicate} from "../interfaces.js";

export default function countCollector<TValue>(source: Iterable<TValue>, predicate?: Predicate<TValue>): number {
    let cnt = 0;
    for (const item of source) {
        if ((predicate && predicate(item)) || !predicate) {
            cnt++;
        }
    }
    return cnt;
}
