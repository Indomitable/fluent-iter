
import { from } from "../../src";

describe('intersect tests', () => {
    it('should do intersection of to sequences', () => {
        expect(from([1, 2, 2, 3]).intersect([2, 1, 5, 5]).toArray()).toEqual([1, 2]);

        expect(from([
            { id: 1, x: 'a' },
            { id: 2, x: 'b' },
            { id: 3, x: 'c' },
        ]).intersect([
            { id: 4, x: 'a' },
            { id: 5, x: 'c' },
            { id: 2, x: 'b' },
            { id: 2, x: 'd' },
        ], (a, b) => a.id === b.id).toArray()).toEqual([{ id: 2, x: 'b' }]);
    });

    it('should return noting if second has no elements', () => {
       expect(from(new Set([1, 2, 3])).intersect([]).toArray()).toEqual([]);
    });

    it('should return noting if no matches', () => {
        expect(from(new Set([1, 2, 3])).intersect(new Set([4, 5, 6])).toArray()).toEqual([]);
        expect(from(new Set([1, 2, 3])).intersect(new Set([4, 5, 6]), (a, b) => a === b).toArray()).toEqual([]);
    });
});

