import { describe, it, expect } from "vitest";
import { from, range, repeat } from "../../src/index.ts";

describe('last finalizer', () => {
    // first

    [
        range(0, 6),
        range(0, 6).toArray()
    ].forEach((source, indx) => {
        it('should return last value: ' + indx, () => {
            const val = from(source).where(_ => _ % 2 !== 0).select(_ => _ * 2).last();
            expect(val).toBe(10);
        });
    });

    [
        range(0, 6),
        range(0, 6).toArray()
    ].forEach((source, indx) => {
        it('should return last value with predicate: ' + indx, () => {
            const val = from(source).last(_ => _ % 2 !== 0);
            expect(val).toBe(5);
        });
    });

    [
        range(0, 6),
        range(0, 6).toArray()
    ].forEach((source, indx) => {
        it('should return undefined if no value: ' + indx, () => {
            const val = from(source).where(_ => _ > 5).last();
            expect(val).toBe(undefined);
        });
    });

    [
        range(0, 6),
        range(0, 6).toArray()
    ].forEach((source, indx) => {
        it('should return undefined if no value - predicate: ' + indx, () => {
            const val = from(source).last(_ => _ > 5);
            expect(val).toBe(undefined);
        });
    });

    // lastOrDefault

    [
        range(1, 6),
        range(1, 6).toArray()
    ].forEach((source, indx) => {
        it('should lastOrDefault return last value: ' + indx, () => {
            const val = from(source).lastOrDefault(9);
            expect(val).toBe(5);
        });
    });

    [
        repeat(3, 4),
        [3, 3, 3, 3]
    ].forEach((source, indx) => {
        it('should lastOrDefault return last value with predicate: ' + indx, () => {
            const val = from(source).lastOrDefault(3, x => x === 3);
            expect(val).toBe(3);
        });
    });

    [
        range(0, 6),
        range(0, 6).toArray()
    ].forEach((source, indx) => {
        it('should lastOrDefault return default if no value: ' + indx, () => {
            const val = from(source).where(_ => _ > 5).lastOrDefault(9);
            expect(val).toBe(9);
        });
    });

    [
        range(0, 6),
        range(0, 6).toArray()
    ].forEach((source, indx) => {
        it('should lastOrDefault return default if no value with predicate: ' + indx, () => {
            const val = from(source).lastOrDefault(9, x => x === 10);
            expect(val).toBe(9);
        });
    });

    // firstOrThrow

    [
        [],
        new Set(),
    ].forEach((source, indx) => {
        it('should lastOrThrow throw exception if not items: ' + indx, () => {
            const val = function () {
                return from(source).lastOrThrow();
            };
            expect(val).toThrowError(TypeError)
        });
    });

    [
        range(4, 0),
        range(4, 0).toArray()
    ].forEach((source, indx) => {
        it('should lastOrThrow return last item: ' + indx, () => {
            const val = from(source).lastOrThrow();
            expect(val).toBe(1);
        });
    });

    [
        range(4, 0),
        range(4, 0).toArray()
    ].forEach((source, indx) => {
        it('should lastOrThrow return last item - predicate: ' + indx, () => {
            const val = from(source).lastOrThrow(x => x === 2);
            expect(val).toBe(2);
        });
    });


    // lastIndex

    [
        [1, 2, 3, 4, 5],
        range(1, 6)
    ].forEach((source, indx) => {
        it('should return index ' + indx, () => {
            const output = from(source).lastIndex(_ => _ === 3);
            expect(output).toEqual(2);
        });
    });


    [
        [],
        repeat(1, 0)
    ].forEach((source, indx) => {
        it('should return -1 when source is empty' + indx, () => {
            const output = from(source).lastIndex(_ => _ === 2);
            expect(output).toEqual(-1);
        });
    });

    [
        [1, 2, 3, 4, 5],
        range(1, 6)
    ].forEach((source, indx) => {
        it('should return -1 when not found' + indx, () => {
            expect(from(source).lastIndex(_ => _ === 10)).toBe(-1);
        });
    });

    [
        [2, 2, 2],
        repeat(2, 3)
    ].forEach((source, indx) => {
        it('should return last found index if multiple values' + indx, () => {
            expect(from(source).lastIndex(_ => _ === 2)).toBe(2);
        });
    });


    it('should return last index when multiple times', () => {
        expect(from([1, 2, 3, 1, 2, 3]).lastIndex(_ => _ === 2)).toBe(4);
    });
});
