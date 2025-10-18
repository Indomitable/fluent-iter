/**
 * Returns generator which repeats value N times
 */
export default function repeatIterable<T>(value: T, times: number): Iterable<T> {
    return {
        [Symbol.iterator]: function* (): Generator<T> {
            for (let i = 0; i < times; i++) {
                yield value;
            }
        }
    };
}
