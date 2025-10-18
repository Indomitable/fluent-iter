import { describe, it, expect } from "vitest";
import { from, fromIterable } from "../../src/index.ts";
import { Person } from "./models.ts";

describe('groupBy tests', () => {
    const input = [
        new Person(10, 'A'),
        new Person(20, 'B'),
        new Person(10, 'C'),
        new Person(30, 'D'),
        new Person(10, 'E'),
        new Person(20, 'F'),
    ];
    const setInput = new Set(input);

    [
        input,
        setInput
    ].forEach((source, indx) => {
        it('should group collection: ' + indx, () => {
            const res = fromIterable(source).groupBy(_ => _.age).toArray();
            expect(res.length).toBe(3);
            for (const gr of res) {
                switch (gr.key) {
                    case 10: {
                        expect(Array.from(gr)).toEqual([ input[0], input[2], input[4] ]);
                        break;
                    }
                    case 20: {
                        expect(Array.from(gr)).toEqual([ input[1], input[5] ]);
                        break;
                    }
                    case 30: {
                        expect(Array.from(gr)).toEqual([ input[3] ]);
                        break;
                    }
                    default:
                        throw new Error('unknown key');
                }
            }
        });
    });

    [
        input,
        setInput
    ].forEach((source, indx) => {
        it('should group collection and select element: ' + indx, () => {
            const res = fromIterable(source).groupBy(_ => _.age, _ => _.name).toArray();
            expect(res.length).toBe(3);
            for (const gr of res) {
                switch (gr.key) {
                    case 10: {
                        expect(from(gr).count()).toBe(3);
                        expect(from(gr).toArray()).toEqual(['A', 'C', 'E']);
                        break;
                    }
                    case 20: {
                        expect(from(gr).count()).toBe(2);
                        expect(from(gr).toArray()).toEqual(['B', 'F']);
                        break;
                    }
                    case 30: {
                        expect(from(gr).count()).toBe(1);
                        expect(from(gr).toArray()).toEqual(['D']);
                        break;
                    }
                    default:
                        throw new Error('unknown key');
                }
            }
        });
    });

    [
        input,
        setInput
    ].forEach((source, indx) => {
        it('should group collection and convert result: ' + indx, () => {
            const res = fromIterable(source).groupBy(_ => _.age, _ => _.name, (key, elms) => `${key}:${Array.from(elms).join(',')}`).toArray();
            expect(res.length).toBe(3);
            expect(res).toEqual(['10:A,C,E', '20:B,F', '30:D']);
        });
    });

    it('should be able to work with strings', () => {
        const res = from('abcdeabcdebbacc').groupBy(_ => _).where(g => from(g).count() < 4).select(g => g.key).join('');
        expect(res).toBe('ade');
    });

    it('should throw if group by object', () => {
        const func = function () { return from(input).groupBy(_ => ({ age: _.age })).toArray() };
        expect(func).toThrowError(TypeError);
    });

    it('should throw if group by function', () => {
        const func = function () { return from(input).groupBy(_ => (function() {})).toArray() };
        expect(func).toThrowError(TypeError);
    });

    it('should not throw if group by null or undefined', () => {
        const res = from('abcdeabcdebbacc')
            .groupBy(_ => _ === 'a' ? null : (_ === 'b' ? undefined : _), _ => _, (key, group) => ({ key: key, group: Array.from(group) }))
            .toArray();
        expect(res).toEqual([
            { key: null, group: ['a', 'a', 'a'] },
            { key: undefined, group: ['b', 'b', 'b', 'b'] },
            { key: 'c', group: ['c', 'c', 'c', 'c'] },
            { key: 'd', group: ['d', 'd'] },
            { key: 'e', group: ['e', 'e'] }
        ]);
    });
});
