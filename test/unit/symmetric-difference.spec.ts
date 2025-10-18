import { describe, it, expect } from "vitest";
import { from } from "../../src/index.ts";

describe('symmetric difference tests', () => {
    it('should do symmetric difference of to sequences', () => {
        expect(from([1, 2, 2, 3]).symmetricDifference([2, 1, 5, 5]).toArray()).toEqual([3, 5]);

        expect(from([
            { id: 1, x: 'a' },
            { id: 2, x: 'b' },
            { id: 3, x: 'c' },
        ]).symmetricDifference([
            { id: 4, x: 'a' },
            { id: 5, x: 'c' },
            { id: 2, x: 'b' },
            { id: 2, x: 'd' },
        ], (a) => a.id).toArray())
            .toEqual([
                { id: 1, x: 'a' },
                { id: 3, x: 'c' },
                { id: 4, x: 'a' },
                { id: 5, x: 'c' },
            ]);
    });

    it('should return all if other has no elements', () => {
        expect(from(new Set([1, 2, 3])).symmetricDifference([]).toArray()).toEqual([1, 2, 3]);
        expect(from(new Set<number>([])).symmetricDifference([1, 2, 3]).toArray()).toEqual([1, 2, 3]);
    });

    it('should return none if have same elements', () => {
        expect(from(new Set([1, 2, 3])).symmetricDifference(new Set([1, 2, 3])).toArray()).toEqual([]);
        expect(from(new Set([1, 2, 3])).symmetricDifference(new Set([1, 2, 3]), (a) => a).toArray()).toEqual([]);
    });
});

