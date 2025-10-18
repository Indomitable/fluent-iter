export default function rangeIterable(from: number, to: number): Iterable<number> {
    return {
        [Symbol.iterator]: function* (): Generator<number> {
            if (from < to) {
                for (let i = from; i < to; i++) {
                    yield i;
                }
            } else {
                for (let i = from; i > to; i--) {
                    yield i;
                }
            }
        }
    };
}
