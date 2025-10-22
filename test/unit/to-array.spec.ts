import {describe, expect, it} from "vitest";
import {fromTimer} from "../../src/index.js";

describe('to array', () => {
    it('should get an array from async iterable', async () => {
        const arr = await fromTimer(5, 0).take(3).toArray();

        expect(arr).toEqual([0, 1, 2]);
    });
});
