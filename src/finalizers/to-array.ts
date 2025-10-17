import type {Mapper} from "../interfaces.ts";

export default function toArrayCollector<T, R>(source: Iterable<T>, map?: Mapper<T, R>): T[] | R[] {
    if (!map) {
        return Array.from(source);
    } else {
        return Array.from(source).map(map);
    }
}
