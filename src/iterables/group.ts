import type {IGrouping} from "../linq-iterable.ts";
import {getIterator, group, IterableGenerator} from "../utils.ts";

export function groupByIterator<TValue, TKey, TElement, TResult>(
    source: Iterable<TValue>,
    keySelector: (item: TValue, index: number) => TKey,
    elementSelector?: (item: TValue, index: number) => TElement,
    resultCreator?: (key: TKey, items: Iterable<TElement>) => TResult): Iterable<IGrouping<TKey, TValue> | IGrouping<TKey, TElement> | TResult> {
    return new IterableGenerator(() => groupByGenerator(source, keySelector, elementSelector, resultCreator));
}

function* groupByGenerator<TValue, TKey, TElement=TValue, TResult=TValue>(
    source: Iterable<TValue>,
    keySelector: (item: TValue, index: number) => TKey,
    elementSelector?: (item: TValue, index: number) => TElement,
    resultCreator?: (key: TKey, items: Iterable<TElement>) => TResult): Generator<IGrouping<TKey, TValue> | IGrouping<TKey, TElement> | TResult> {
    const elementSelect: (item: TValue, index: number) => TElement = elementSelector ?? ((item) => item as unknown as TElement);
    const resultCreate: (key: TKey, items: Iterable<TElement>) => TResult = resultCreator ??
        ((key, items) => new Grouping(key, items) as unknown as TResult);

    const groups = group(source, keySelector, elementSelect);
    for (const [key, items] of groups.entries()) {
        yield resultCreate(key, items);
    }
}

export class Grouping<TKey, TValue> implements IGrouping<TKey, TValue> {
    readonly #key: TKey;
    readonly #items: Iterable<TValue>;
    constructor(key: TKey, items: Iterable<TValue>) {
        this.#key = key;
        this.#items = items;
    }

    public get key() {
        return this.#key;
    }

    [Symbol.iterator]() {
        return getIterator(this.#items);
    }
}
// import { BaseLinqIterable } from "../base-linq-iterable";
// import { fromIterable } from "../creation";
// import { defaultElementSelector } from "../utils";
//
// export class Grouping extends BaseLinqIterable {
//     constructor(key, source) {
//         super(source);
//         this.key = key;
//     }
//
//     get() {
//         return this.source;
//     }
//
//     [Symbol.iterator]() {
//         return this._getIterator(this.source);
//     }
// }
//
// export class GroupIterable extends BaseLinqIterable {
//     constructor(source, keySelector, elementSelector, resultCreator) {
//         super(source);
//         if (typeof keySelector === 'undefined') {
//             throw new Error('keyselector is required');
//         }
//         this.keySelector = keySelector;
//         this.elementSelector = typeof elementSelector === 'undefined' ? defaultElementSelector : elementSelector;
//         this.resultCreator = typeof resultCreator === 'undefined' ? (key, grouping) => (new Grouping(key, grouping)) : resultCreator;
//     }
//

//
//     [Symbol.iterator]() {
//         const source = this._getSource();
//         const result = GroupIterable.__group(source, this.keySelector, this.elementSelector);
//         const groupIterator = this._getIterator(result);
//         const resultCreator = this.resultCreator;
//         return {
//             next() {
//                 const { done, value } = groupIterator.next();
//                 if (done) {
//                     result.clear();
//                     return { done: true };
//                 }
//                 const [ key, grouping ] = value;
//                 return {
//                     done: false,
//                     value: resultCreator(key, fromIterable(grouping))
//                 };
//             }
//         }
//     }
// }
