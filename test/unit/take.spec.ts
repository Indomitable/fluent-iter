import { describe, it, expect } from "vitest";
import { from, fromIterable, range } from "../../src/index.ts";

describe('take tests', () => {
    [
        [1, 2, 3, 4, 5],
        new Set([1, 2, 3, 4, 5])
    ].forEach((source, indx) => {
        it('should take first n numbers: ' + indx, () => {
            const output0 = fromIterable(source).take(3).toArray();
            expect(output0).toEqual([1, 2, 3]);
        });
    });

    [
        [1, 2, 3, 4, 5],
        new Set([1, 2, 3, 4, 5])
    ].forEach((source, indx) => {
        it('should take first n numbers after another operation: ' + indx, () => {
            const output0 = fromIterable(source).where(_ => _ > 2).take(3).toArray();
            expect(output0).toEqual([3, 4, 5]);
        });
    });

    [
        [1, 2, 3, 4, 5],
        new Set([1, 2, 3, 4, 5])
    ].forEach((source, indx) => {
        it('should take be able to continue with another operator: ' + indx, () => {
            const output0 = fromIterable(source)
                .where(_ => _ > 2)
                .take(3)
                .select(x => `item_${x}`)
                .toArray();
            expect(output0).toEqual(['item_3', 'item_4', 'item_5']);
        });
    });

    [
        [1, 2],
        new Set([1, 2])
    ].forEach((source, indx) => {
        it('should take all elements if source count is less: ' + indx, () => {
            // use array
            const res = fromIterable(source)
                .take(3)
                .toArray();
            expect(res).toEqual([1, 2]);
        });
    });

    [
        [],
        new Set()
    ].forEach((source, indx) => {
        it('should take nothing from empty collection: ' + indx, () => {
            const res = fromIterable(source)
                .take(1)
                .toArray();
            expect(res).toEqual([]);
        });
    });


    [
        [1, 2, 3, 4, 5],
        range(1, 6)
    ].forEach((source, indx) => {
        it('should return empty when none to be taken' + indx, () => {
            expect(from(source).take(0).toArray()).toEqual([]);
            expect(from(source).take(-1).toArray()).toEqual([]);
        });
    });
});
