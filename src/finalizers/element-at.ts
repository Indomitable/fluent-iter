export default function elementAtCollector<TValue>(source: Iterable<TValue>, index: number): TValue | undefined {
    let idx = 0;
    for (const item of source) {
        if (idx === index) {
            return item;
        }
        idx++;
    }
}
