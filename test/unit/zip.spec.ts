import {describe, expect, it} from "vitest";
import {fromAsyncIterable, range} from "../../src/index.ts";
import {testAsyncIterable} from "../test-utils.ts";

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

describe('zip async iterable tests', () => {
    it('should combine two iterables', async () => {
        const result = await testAsyncIterable(5)
            .zip(testAsyncIterable(5))
            .toArray();
        expect(result).toEqual([
            [0, 0], [1, 1], [2, 2], [3, 3], [4, 4]
        ]);
    });

    it('should combine two iterables from different type', async () => {
        const result = await fromAsyncIterable(testAsyncIterable(5))
            .zip(testAsyncIterable(5).map(x => x.toString()))
            .toArray();
        expect(result).toEqual([
            [0, '0'], [1, '1'], [2, '2'], [3, '3'], [4, '4']
        ]);
    });

    it('should stop as soon one fishes', async () => {
        const result1 = await fromAsyncIterable(testAsyncIterable(5))
            .zip(testAsyncIterable(4))
            .toArray();
        expect(result1).toEqual([
            [0, 0], [1, 1], [2, 2], [3, 3]
        ]);

        const result2 = await fromAsyncIterable(testAsyncIterable(4))
            .zip(testAsyncIterable(5))
            .toArray();
        expect(result2).toEqual([
            [0, 0], [1, 1], [2, 2], [3, 3]
        ]);
    });
});
