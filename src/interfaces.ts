// export interface InternalIterable<T> extends Iterable<T> {
//     getInner(): Iterable<T>;
// }

export type Predicate<T> = (item: T) => boolean;

export type Mapper<T, R> = (item: T) => R;

export type Comparator<T> = (a: T, b: T) => number;
export type Equality<T> = (a: T, b: T) => boolean;