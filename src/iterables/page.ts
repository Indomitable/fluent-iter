import {IterableGenerator} from "../utils.ts";

export default function pageIterator<TValue>(source: Iterable<TValue>, pageSize: number): Iterable<TValue[]> {
    return new IterableGenerator(() => pageGenerator(source, pageSize));
}

function* pageGenerator<TValue>(source: Iterable<TValue>, pageSize: number): Generator<TValue[]> {
    let page: TValue[] = [];
    for (const item of source) {
        page.push(item);
        if (page.length === pageSize) {
            yield page;
            page = [];
        }
    }
    if (page.length > 0) {
        yield page;
    }
}
