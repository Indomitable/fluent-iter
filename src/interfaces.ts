export type Predicate<T> = (item: T) => boolean;
export type Mapper<T, R> = (item: T) => R;
export type ComparerResult = -1 | 0 | 1 | number;
export type Comparer<T> = (a: T, b: T) => ComparerResult;
export type Equality<T> = (a: T, b: T) => boolean;
export type Action<T> = (item: T) => void;
