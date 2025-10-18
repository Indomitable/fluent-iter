import {describe, expect, it} from "vitest";
import {range} from "../../src/index.ts";

describe('zip iterable tests', () => {
    it('should combine two iterables', () => {
        expect(range(0, 5).zip(range(0, 5)).toArray()).toEqual([
            [0, 0], [1, 1], [2, 2], [3, 3], [4, 4]
        ]);
    });
    it('should combine two iterables from different type', () => {
        expect(range(0, 5).zip(['0', '1', '2', '3', '4']).toArray()).toEqual([
            [0, '0'], [1, '1'], [2, '2'], [3, '3'], [4, '4']
        ]);
    });
    it('should stop as soon one fishes', () => {
        expect(range(0, 5).zip(range(0, 4)).toArray()).toEqual([
            [0, 0], [1, 1], [2, 2], [3, 3]
        ]);
        expect(range(0, 4).zip(range(0, 5)).toArray()).toEqual([
            [0, 0], [1, 1], [2, 2], [3, 3]
        ]);
    });
});
