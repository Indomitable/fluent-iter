import { describe, it, expect } from "vitest";
import {
    from,
    fromArrayLike,
    fromIterable,
    fromObject,
    range,
} from "../../src/index.ts";

describe("from creation tests", () => {
    it("should create a linq iterable from collection", () => {
        const val = fromIterable([1, 2, 3]);
        expect(typeof val.where === "function").toBe(true);
        expect(typeof val.select === "function").toBe(true);
        expect(typeof val.selectMany === "function").toBe(true);
        expect(typeof val.first === "function").toBe(true);
        expect(typeof val.single === "function").toBe(true);
    });

    it("should create a linq iterable from object", () => {
        const val = fromObject({ a: 1, b: 2, 10: 3 });
        expect(typeof val.where === "function").toBe(true);
        expect(typeof val.select === "function").toBe(true);
        expect(typeof val.selectMany === "function").toBe(true);
        expect(typeof val.first === "function").toBe(true);
        expect(typeof val.single === "function").toBe(true);
        const res = val.toArray();
        expect(res).toEqual([
            { key: "10", value: 3 },
            { key: "a", value: 1 },
            { key: "b", value: 2 },
        ]);
    });

    it("should create a linq iterable from object and to accept resultCreator", () => {
        const val = fromObject({ a: 1, b: 2, 10: 3 }, (k, v) => [
            k,
            v,
        ]).toArray();
        expect(val).toEqual([
            ["10", 3],
            ["a", 1],
            ["b", 2],
        ]);
    });

    it("should create a linq iterable from object when input is an array", () => {
        const res = fromObject([1, 2, 3]).toArray();
        expect(res).toEqual([
            { key: "0", value: 1 },
            { key: "1", value: 2 },
            { key: "2", value: 3 },
        ]);
    });

    it("should create a linq iterable from ArrayLike object", () => {
        const input = {
            0: "A",
            1: "B",
            2: "C",
            3: "D",
            name: "E",
            something: "F",
            length: 4,
        };
        const seq = fromArrayLike(input).toArray().join(",");
        expect(seq).toBe("A,B,C,D");
    });

    it("should create undefined values for missing indexes in ArrayLike object", () => {
        const res0 = Array.from(
            fromArrayLike({ 0: "a", 3: "b", 5: "c", length: 6 }),
        );
        expect(res0).toEqual(["a", undefined, undefined, "b", undefined, "c"]);

        const res1 = Array.from(
            fromArrayLike({ 0: "a", 2: "b", 5: "c", length: 3 }),
        );
        expect(res1).toEqual(["a", undefined, "b"]);
    });

    [
        new Set([0, 1, 2, 3]),
        range(0, 4),
        [0, 1, 2, 3],
        { 0: 0, 1: 1, 2: 2, 3: 3, length: 4 },
    ].forEach((source, indx) => {
        it(
            "should from create a linq iterable from different objects: " +
                indx,
            () => {
                const l = from(source).toArray();
                expect(l).toEqual([0, 1, 2, 3]);
            },
        );
    });

    it("should from create a linq iterable from objects", () => {
        const l = from({ a: 0, b: 1 }).toArray();
        expect(l).toEqual([
            { key: "a", value: 0 },
            { key: "b", value: 1 },
        ]);
    });
});
