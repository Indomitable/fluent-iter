export default function reverseIterator<TValue> (input: Iterable<TValue>): Iterable<TValue> {
    return [...input].reverse();
}
