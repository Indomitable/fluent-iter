import {describe, expect, it} from "vitest";
import {fromTimer} from "../../src/generators/from-timer.ts";

describe('fromTimer', () => {
    it('should return iterable of number every x milliseconds', async () => {
        await using numbersStream = fromTimer(100);
        const numbers: number[] = [];
        for await (const n of numbersStream) {
            numbers.push(n);
            if (numbers.length === 3) {
                break;
            }
        }
        expect(numbers.length).toEqual(3);
    });
});
