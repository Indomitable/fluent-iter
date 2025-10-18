import { describe, it, expect } from "vitest";
import { fromIterable, range } from "../../src/index.ts";

describe('select tests', () => {
    [
        ['a', 'b', 'c', 'd'],
        new Set(['a', 'b', 'c', 'd'])
    ].forEach((source, indx) => {
        it('should map sequence: ' + indx, () => {
            const input = fromIterable(source).select(_ => _ + 'a');
            const result = Array.from(input);
            expect(result).toEqual(['aa', 'ba', 'ca', 'da']);
        });
    });

    [
        ['a', 'b', 'c', 'd'],
        new Set(['a', 'b', 'c', 'd'])
    ].forEach((source, indx) => {
        it('should map after filter: ' + indx, () => {
            const input = fromIterable(source).where(_ => _ !== 'a').select(_ => _ + 'a');
            const result = Array.from(input);
            expect(result).toEqual(['ba', 'ca', 'da']);
        });
    });

    [
        ['a', 'b', 'c', 'd'],
        new Set(['a', 'b', 'c', 'd'])
    ].forEach((source, indx) => {
        it('should be able to continue: ' + indx, () => {
            const result = fromIterable(source).select(_ => _ + 'a').select(_ => 'b' + _).toArray();
            expect(result).toEqual(['baa', 'bba', 'bca', 'bda']);
        });
    });

    [
        range(1, 8),
        range(1, 8).toArray()
    ].forEach((source, indx) => {
        it('should be iterable multiple times: ' + indx, () => {
            const numbers = fromIterable(source).select(_ => _ * 2);
            expect(Array.from(numbers)).toEqual([2, 4, 6, 8, 10, 12, 14]);
            expect(Array.from(numbers)).toEqual([2, 4, 6, 8, 10, 12, 14]);
        });
    });
});
