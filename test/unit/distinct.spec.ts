import { describe, it, expect } from "vitest";
import { from, fromIterable } from "../../src/index.ts";
import { Person } from "./models.ts";

describe('distinct tests', () => {
    [
        [1, 2, 3, 1, 5, 2, 'a', 'a'],
        new Set([1, 2, 3, 1, 5, 2, 'a', 'a'])
    ].forEach((source, indx) => {
        it('should return distinct values: ' + indx, () => {
            const input = fromIterable(source);
            expect(input.distinct().toArray()).toEqual([1, 2, 3, 5, 'a']);
        });
    });

    [
        [], new Set()
    ].forEach((source, indx) => {
        it('should return empty when no values: ' + indx, () => {
            const input = fromIterable(source);
            expect(input.distinct().toArray()).toEqual([]);
        });
    });

    [
        [1, 2, 3, 5, 'a', 'b'],
        new Set([1, 2, 3, 5, 'a', 'b'])
    ].forEach((source, indx) => {
        it('should use comparer when provided: ' + indx, () => {
            const input = fromIterable(source);
            expect(input.distinct((a) => typeof a).toArray()).toEqual([1, 'a']);
        });
    });

    [
        [1, 2, 3, 1, 5, 2, 'a', 'a'],
        new Set([1, 2, 3, 1, 5, 2, 'a', 'a'])
    ].forEach((source, indx) => {
        it('should be able to continue: ' + indx, () => {
            const input = fromIterable(source);
            expect(input.distinct().where(_ => typeof _ === 'string').toArray()).toEqual(['a']);
        });
    });

    it('should do a distinct of object by key', () => {
        const persons = [
            new Person(10, 'A'),
            new Person(20, 'B'),
            new Person(10, 'C'),
            new Person(20, 'D'),
        ];
        const res = from(persons).distinct((a) => a.age).toArray();
        expect(res).toEqual([
            new Person(10, 'A'),
            new Person(20, 'B'),
        ]);
    });
});
