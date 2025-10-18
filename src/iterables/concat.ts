export default function concatIterator<TFirst, TSecond=TFirst>(first: Iterable<TFirst>, second: Iterable<TSecond>): Iterable<TFirst | TSecond> {
    return {
        [Symbol.iterator]: function* () {
            yield* first;
            yield* second;
        }
    }
}
