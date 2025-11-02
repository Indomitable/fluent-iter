import {describe, expect, it} from "vitest";
import {fromTimer} from "../../src/index.ts";
import {delay} from "../../src/utils.ts";
import fromTimerAsync from "../../src/generators/from-timer.ts";

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

    it('should start with a delay', async () => {
        const startTime = performance.now();
        const numbersStream = fromTimer(10, 20);
        const numbers: number[] = [];
        for await (const n of numbersStream) {
            numbers.push(n);
            if (numbers.length === 1) {
                break;
            }
        }
        const endTime = performance.now();
        expect(numbers).toEqual([0]);
        expect(Math.ceil(endTime - startTime)).toBeGreaterThan(19.9);
    });

    it('should stop the timer when iteration breaks', async () => {
        let counter = 0;
        const numbersStream = fromTimer(10);
        for await (const _ of numbersStream) {
            counter++;
            if (counter === 2) {
                break;
            }
        }
        // Wait a bit to ensure no further emissions
        await delay(100);
        expect(counter).toEqual(2);
    });

    it('should stop if disposed is called', async () => {
        const numbersStream = fromTimerAsync(10, 50);
        const iterator = numbersStream[Symbol.asyncIterator]();
        const dispose = numbersStream[Symbol.dispose];
        const numbers: number[] = [];
        iterator.next().then(x => {
            if (!x.done) {
                numbers.push(x.value);
            }
        });
        dispose();
        await delay(100); // wait to check if something is not emitted.
        expect(numbers).toStrictEqual([]);
    });
});
