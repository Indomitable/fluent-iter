import { describe, it, expect } from "vitest";
import { from } from "../../src/index.ts";

describe('difference tests', () => {
    it('should do difference of to sequences', () => {
        expect(from([1, 2, 2, 3]).difference([2, 1, 5, 5]).toArray()).toEqual([3]);

        expect(from([
            { id: 1, x: 'a' },
            { id: 2, x: 'b' },
            { id: 3, x: 'c' },
        ]).difference([
            { id: 4, x: 'a' },
            { id: 5, x: 'c' },
            { id: 2, x: 'b' },
            { id: 2, x: 'd' },
        ], (a) => a.id).toArray())
            .toEqual([
                { id: 1, x: 'a' },
                { id: 3, x: 'c' }
            ]);
    });

    it('should return all if second has no elements', () => {
       expect(from(new Set([1, 2, 3])).difference([]).toArray()).toEqual([1, 2, 3]);
    });

    it('should return all if no matches', () => {
        expect(from(new Set([1, 2, 3])).difference(new Set([4, 5, 6])).toArray()).toEqual([1, 2, 3]);
        expect(from(new Set([1, 2, 3])).difference(new Set([4, 5, 6]), (a) => a).toArray()).toEqual([1, 2, 3]);
    });
});

