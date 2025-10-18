// combines two iterables
export default function zipIterable<TThis, TOuter>(first: Iterable<TThis>, second: Iterable<TOuter>): Iterable<[TThis, TOuter]> {
    return {
        [Symbol.iterator]: function* () {
            const firstIterator = first[Symbol.iterator]();
            const secondIterator = second[Symbol.iterator]();
            while (true) {
                const firstResult = firstIterator.next();
                const secondResult = secondIterator.next();
                if (firstResult.done || secondResult.done) {
                    break;
                }
                yield [firstResult.value, secondResult.value];
            }
        }
    }
}
