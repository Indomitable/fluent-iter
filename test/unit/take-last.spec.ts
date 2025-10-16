import { describe, it, expect } from "vitest";
import {from, range, repeat} from "../../src/index.ts";

describe('take last tests', () => {
    [
        [1, 2, 3, 4, 5],
        range(1, 6)
    ].forEach((source, indx) => {
        it('should take last 2 elements: ' + indx, () => {
            const output = from(source).takeLast(2).toArray();
            expect(output).toEqual([4, 5]);
        });
    });


    [
        [],
        repeat(1, 0)
    ].forEach((source, indx) => {
        it('should return empty when source is empty' + indx, () => {
            const output = from(source).takeLast(3).toArray();
            expect(output).toEqual([]);
        });
    });

    [
        [1, 2, 3, 4, 5],
        range(1, 6)
    ].forEach((source, indx) => {
        it('should return empty when none to be taken' + indx, () => {
            expect(from(source).takeLast(0).toArray()).toEqual([]);
            expect(from(source).takeLast(-1).toArray()).toEqual([]);
        });
    });


    it('should able to continue the query', () => {
        const output = range(0, 10).takeLast(3).select(_  => _ * 2).toArray();
        expect(output).toEqual([14, 16, 18])
    });

    it('should able to execute multiple times', () => {
        const output = range(0, 10).takeLast(3).select(_  => _ * 2);
        expect(Array.from(output)).toEqual([14, 16, 18]);
        expect(Array.from(output)).toEqual([14, 16, 18]);
    });
});
