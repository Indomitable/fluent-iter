import { describe, it, expect } from "vitest";
import { from, fromIterable } from "../../src/index.ts";

describe('select many tests', () => {
    [
        [
            {item: [1, 2, 3, 4]},
            {item: ['a', 'b', 'c', 'd']},
        ],
        new Set([
            {item: [1, 2, 3, 4]},
            {item: ['a', 'b', 'c', 'd']},
        ])
    ].forEach((source, indx) => {
        it('should map iterable: ' + indx, () => {
            const resSelectMany = fromIterable(source)
                .selectMany<string|number>(_ => _.item)
                .toArray();
            expect(resSelectMany).toEqual([1, 2, 3, 4, 'a', 'b', 'c', 'd']);

            const resFlat = from(source)
                .selectMany<string|number, {}>(_ => _.item, (outer, inner) => ({ outer, inner})).toArray();
            const flatResExpected = [];
            for (const outer of source) {
                for (const inner of outer.item) {
                    flatResExpected.push({ outer, inner });
                }
            }
            expect(resFlat).toEqual(flatResExpected);
        });
    });

    [
        [
            {item: [1, 2, 3, 4]},
            {item: []},
            {item: []},
            {item: [5, 6, 7]},
            {item: []},
            {item: [8, 9]},
            {item: [10]},
        ],
        new Set([
            {item: [1, 2, 3, 4]},
            {item: []},
            {item: []},
            {item: [5, 6, 7]},
            {item: []},
            {item: [8, 9]},
            {item: [10]},
        ])
    ].forEach((source, indx) => {
        it('should map iterable with empties: ' + indx, () => {
            const resultSelectMany = fromIterable(source).selectMany(_ => _.item).toArray();
            expect(resultSelectMany).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

            const resFlat = from(source).selectMany(_ => _.item, (outer, inner) => ({ outer, inner })).toArray();
            const flatResExpected = [];
            for (const outer of source) {
                for (const inner of outer.item) {
                    flatResExpected.push({ outer, inner });
                }
            }
            expect(resFlat).toEqual(flatResExpected);
            expect(resFlat.length).toEqual(resultSelectMany.length);
        });
    });

    [
        [
            {item: [1, 2, 3, 4]},
            {item: ['a', 'b', 'c', 'd']},
        ],
        new Set([
            {item: [1, 2, 3, 4]},
            {item: ['a', 'b', 'c', 'd']},
        ])
    ].forEach((source, indx) => {
        it('should be possible to continue: ' + indx, () => {
            const resultSelectMany = fromIterable(source).selectMany<string|number>(_ => _.item).where(i => i === 2).select(_ => _ * 2).toArray();
            expect(resultSelectMany).toEqual([4]);

            const resultFlat = fromIterable(source).selectMany<string|number, { inner: number|string }>(_ => _.item, (outer, inner) => ({ outer, inner}))
                .select(i => i.inner)
                .where<number>(i => typeof i === 'number')
                .where(i => i === 2)
                .select(_ => _ * 2)
                .toArray();
            expect(resultFlat).toEqual(resultSelectMany);
        });
    });
});
