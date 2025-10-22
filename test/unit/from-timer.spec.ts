import {describe, expect, it} from "vitest";
import {fromTimer} from "../../src/index.ts";

describe('fromTimer', () => {
    it('should return iterable of number every x milliseconds', async () => {
        const numbersStream = fromTimer(100);
        const numbers: number[] = [];
        for await (const n of numbersStream) {
            numbers.push(n);
            if (numbers.length === 3) {
                break;
            }
        }
        expect(numbers.length).toEqual(3);
    });

    it('should return iterable of number every x milliseconds', async () => {
        const numbersStream = fromTimer(2).where(n => n % 2 === 0).select(n => n * 2);
        const numbers: number[] = [];
        for await (const n of numbersStream) {
            numbers.push(n);
            if (numbers.length === 3) {
                break;
            }
        }
        expect(numbers).toEqual([ 0, 4, 8 ]);
    });
});
