import type {Action} from "../interfaces.ts";

export default function forEachCollector<TValue>(source: Iterable<TValue>, action: Action<TValue>): void {
    for (const item of source) {
        action(item);
    }
}
