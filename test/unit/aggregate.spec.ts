import { describe, it, expect } from "vitest";
import { fromIterable, range } from "../../src/index.ts";

describe('aggregate tests', () => {
    [
        range(0, 10),
        range(0, 10).toArray()
    ].forEach((source, indx) => {
        it('should aggregate collection: ' + indx, () => {
            const res = fromIterable(source).aggregate((a, item) => a + item);
            expect(res).toBe(9 * 10 / 2);
        });
    });

    [
        range(0, 0),
        range(0, 0).toArray()
    ].forEach((source, indx) => {
        it('should throw when not items: ' + indx, () => {
            // use iterable
            const res = function () {
                return fromIterable(source).aggregate((a, item) => a + item);
            };
            expect(res).toThrowError(TypeError);
        });
    });

    [
        range(0, 10),
        range(0, 10).toArray()
    ].forEach((source, indx) => {
        it('should aggregate collection with initial value: ' + indx, () => {
            // use iterable
            const res = fromIterable(source).aggregate((a, item) => a + item, 1);
            expect(res).toBe(1 + (9 * 10 / 2));
        });
    });

    [
        range(0, 10),
        range(0, 10).toArray()
    ].forEach((source, indx) => {
        it('should get sum of collection: ' + indx, () => {
            // use iterable
            const res = fromIterable(source).sum();
            expect(res).toBe(9 * 10 / 2);
        });
    });

    it('should sum throw when no items', () => {
        const res = function () {
            return fromIterable([]).sum();
        };
        expect(res).toThrowError(TypeError);
    });

    [
        range(1, 10),
        range(1, 10).toArray()
    ].forEach((source, indx) => {
        it('should get product of collection: ' + indx, () => {
            const product = 2 * 3 * 4 * 5 * 6 * 7 * 8 * 9;
            // use iterable
            const res = fromIterable(source).product();
            expect(res).toBe(product);
        });
    });

    it('should product throw when no items', () => {
        const res = function () {
            return fromIterable([]).product();
        };
        expect(res).toThrowError(TypeError);
    });

    [
        range(0, 10),
        range(0, 10).toArray()
    ].forEach((source, indx) => {
        it('should get min value: ' + indx, () => {
            // use iterable
            const res = fromIterable(source).min();
            expect(res).toBe(0);
        });
    });

    it('should get min value with comparer', () => {
        const res = fromIterable([{ age: 10 }, { age: 5 }, { age: 6 }]).min((a, b) => a.age - b.age);
        expect(res).toEqual({ age: 5 });
    });

    it('should min throw when no items', () => {
        const res = function () {
            return fromIterable([]).min();
        };
        expect(res).toThrowError(TypeError);
    });

    it('should min equal items', () => {
        const res = fromIterable([1, 2, 1]).min();
        expect(res).toBe(1);
    });

    [
        range(0, 10),
        range(0, 10).toArray()
    ].forEach((source, indx) => {
        it('should get max value: ' + indx, () => {
            // use iterable
            const res = fromIterable(source).max();
            expect(res).toBe(9);
        });
    });

    it('should get max value with comparer', () => {
        const res = fromIterable([{ age: 10 }, { age: 5 }, { age: 6 }]).max((a, b) => a.age - b.age);
        expect(res).toEqual({ age: 10 });
    });

    it('should max throw when no items', () => {
        const res = function () {
            return fromIterable([]).max();
        };
        expect(res).toThrowError(TypeError);
    });

    it('should max equal items', () => {
        const res = fromIterable([1, 2, 1, 3, 3]).max();
        expect(res).toBe(3);
    });
});