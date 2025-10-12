
import { from, fromIterable, range, repeat } from "../../src";

describe('first finalizer', () => {
    // first

    [
        range(0, 6),
        range(0, 6).toArray()
    ].forEach((source, indx) => {
        it('should return first value: ' + indx, () => {
            const val = fromIterable(source).where(_ => _ % 2 !== 0).select(_ => _ * 2).first();
            expect(val).toBe(2);
        });
    });

    [
        range(0, 6),
        range(0, 6).toArray()
    ].forEach((source, indx) => {
        it('should return first value with predicate: ' + indx, () => {
            const val = fromIterable(source).first(_ => _ % 2 !== 0);
            expect(val).toBe(1);
        });
    });

    [
        range(0, 6),
        range(0, 6).toArray()
    ].forEach((source, indx) => {
        it('should return undefined if no value: ' + indx, () => {
            const val = fromIterable(source).where(_ => _ > 5).first();
            expect(val).toBe(undefined);
        });
    });

    [
        range(0, 6),
        range(0, 6).toArray()
    ].forEach((source, indx) => {
        it('should return undefined if no value - predicate: ' + indx, () => {
            const val = fromIterable(source).first(_ => _ > 5);
            expect(val).toBe(undefined);
        });
    });

    // firstOrDefault

    [
        range(1, 6),
        range(1, 6).toArray()
    ].forEach((source, indx) => {
        it('should firstOrDefault return first value: ' + indx, () => {
            const val = fromIterable(source).firstOrDefault(9);
            expect(val).toBe(1);
        });
    });

    [
        range(1, 6),
        range(1, 6).toArray()
    ].forEach((source, indx) => {
        it('should firstOrDefault return first value with predicate: ' + indx, () => {
            const val = fromIterable(source).firstOrDefault(9, x => x === 3);
            expect(val).toBe(3);
        });
    });

    [
        range(0, 6),
        range(0, 6).toArray()
    ].forEach((source, indx) => {
        it('should firstOrDefault return default if no value: ' + indx, () => {
            const val = fromIterable(source).where(_ => _ > 5).firstOrDefault(9);
            expect(val).toBe(9);
        });
    });

    [
        range(0, 6),
        range(0, 6).toArray()
    ].forEach((source, indx) => {
        it('should firstOrDefault return default if no value with predicate: ' + indx, () => {
            const val = fromIterable(source).firstOrDefault(9, x => x === 10);
            expect(val).toBe(9);
        });
    });

    // firstOrThrow

    [
        [],
        new Set(),
    ].forEach((source, indx) => {
        it('should firstOrThrow throw exception if not items: ' + indx, () => {
            const val = function () {
                return fromIterable(source).firstOrThrow();
            };
            expect(val).toThrowError(TypeError)
        });
    });

    [
        range(4, 0),
        range(4, 0).toArray()
    ].forEach((source, indx) => {
        it('should firstOrThrow return first item: ' + indx, () => {
            const val = fromIterable(source).firstOrThrow();
            expect(val).toBe(4);
        });
    });

    [
        range(4, 0),
        range(4, 0).toArray()
    ].forEach((source, indx) => {
        it('should firstOrThrow return first item - predicate: ' + indx, () => {
            const val = fromIterable(source).firstOrThrow(x => x === 2);
            expect(val).toBe(2);
        });
    });

    // firstIndex

    [
        [1, 2, 3, 4, 5],
        range(1, 6)
    ].forEach((source, indx) => {
        it('should find element index ' + indx, () => {
            const output = from(source).firstIndex(_ => _ === 3);
            expect(output).toEqual(2);
        });
    });


    [
        [],
        range()
    ].forEach((source, indx) => {
        it('should return -1 when source is empty' + indx, () => {
            const output = from(source).firstIndex(_ => _ === 2);
            expect(output).toEqual(-1);
        });
    });

    [
        [1, 2, 3, 4, 5],
        range(1, 6)
    ].forEach((source, indx) => {
        it('should return -1 when not found' + indx, () => {
            expect(from(source).firstIndex(_ => _ === 10)).toBe(-1);
        });
    });

    [
        [2, 2, 2],
        repeat(2, 3)
    ].forEach((source, indx) => {
        it('should return first found index if multiple values' + indx, () => {
            expect(from(source).firstIndex(_ => _ === 2)).toBe(0);
        });
    });
});
