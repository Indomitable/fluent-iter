import { describe, it, expect } from "vitest";
import { fromIterable, range } from "../../src/index.ts";

describe('element at tests', () => {

    [
        range(0, 10),
        range(0, 10).toArray(),
    ].forEach((source, indx) => {
        it('get elements on different indexes: ' + indx, () => {
            const iterable = fromIterable(source);
            for (const i of range(0, 10)) {
                expect(iterable.elementAt(i)).toBe(i);
            }
            expect(iterable.elementAt(11)).toBe(undefined);
        });
    });

    it('should work alias', () => {
        const source = range(0, 10).at(2);
        expect(source).toBe(2);
    });

    it('should return undefined for out of range index', () => {
        const source = range(0, 5);
        expect(source.at(10)).toBe(undefined);
    });
});
