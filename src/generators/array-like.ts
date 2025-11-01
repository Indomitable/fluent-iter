export default function arrayLikeIterator<T>(source: ArrayLike<T>): Iterable<T> {
    return {
        [Symbol.iterator]: function* () {
            for (let i = 0; i < source.length; i++) {
                yield source[i];
            }
        }
    }
}
