import {IterableGenerator} from "../utils.ts";

export default function concatIterator<TFirst, TSecond=TFirst>(first: Iterable<TFirst>, second: Iterable<TSecond>): Iterable<TFirst | TSecond> {
    return new IterableGenerator(() => concatGenerator(first, second));
}

function* concatGenerator<TFirst, TSecond=TFirst>(first: Iterable<TFirst>, second: Iterable<TSecond>): Generator<TFirst | TSecond> {
    yield* first;
    yield* second;
}
