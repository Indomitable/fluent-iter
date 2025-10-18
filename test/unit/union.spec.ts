import { describe, it, expect } from "vitest";
import { from, range } from "../../src/index.ts";
import {Person} from "./models.js";

describe('union tests', () => {
    [
        { first: range(0, 10), second: range(0, 10) },
        { first: range(0, 10).toArray(), second: range(0, 10).toArray() },
    ].forEach((source, indx) => {
        it('should union make a set iterable from both iterables: ' + indx, () => {
            const res = from(source.first).union(source.second).toArray();
            expect(res).toEqual(range(0, 10).toArray());
        });
    });

    [
        { first: new Set(['a', 'b', 'c']), second: new Set(['b', 'd']) },
        { first: Array.from(new Set(['a', 'b', 'c'])), second: new Set(['b', 'd']) }
    ].forEach((source, indx) => {
        it('should union make a set iterable from both strings iterables: ' + indx, () => {
            const res = from(source.first).union(source.second).toArray();
            expect(res).toEqual(['a', 'b', 'c', 'd']);
        });
    });

    it('should work with strings', () => {
        const res = from('abcdefg').union('abcjkf').join('');
        expect(res).toEqual('abcdefgjk')
    });

    it('union on complex objects', () => {
        const first = [
            new Person(10, 'A'),
            new Person(20, 'B'),
            new Person(20, 'B'),
            new Person(30, 'C'),
        ];
        const seconds = [
            new Person(40, 'C'),
            new Person(10, 'D'),
        ];
        const res = from(first).union(seconds, i => i.name).toArray();
        expect(res).toEqual([
            new Person(10, 'A'),
            new Person(20, 'B'),
            new Person(30, 'C'),
            new Person(10, 'D'),
        ])
    });
});
