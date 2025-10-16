import { describe, it, expect } from "vitest";
import { from, fromIterable } from "../../src/index.ts";

describe("where tests", () => {
    [[1, 2, 3, 4, 5, 6, 7], new Set([1, 2, 3, 4, 5, 6, 7])].forEach(
        (source, indx) => {
            it("should filter collections: " + indx, () => {
                const evenNumbers = fromIterable(source).where(
                    (_) => _ % 2 === 0,
                );
                expect(Array.from(evenNumbers)).toEqual([2, 4, 6]);
            });
        },
    );

    [[1, 2, 3, 4, 5, 6, 7], new Set([1, 2, 3, 4, 5, 6, 7])].forEach(
        (source, indx) => {
            it("should filter multiple times: " + indx, () => {
                const evenNumbers = fromIterable(source)
                    .where((_) => _ % 2 === 0)
                    .where((_) => _ > 3);
                expect(Array.from(evenNumbers)).toEqual([4, 6]);
            });
        },
    );

    [[1, 2, 3, 4, 5, 6, 7], new Set([1, 2, 3, 4, 5, 6, 7])].forEach(
        (source, indx) => {
            it("should be iterable multiple times: " + indx, () => {
                const numbers = fromIterable(source).where((_) => _ % 2 === 0);
                expect(Array.from(numbers)).toEqual([2, 4, 6]);
                expect(Array.from(numbers)).toEqual([2, 4, 6]);
            });
        },
    );

    it("should be able to work with strings", () => {
        const res = from("aabbccdd")
            .where((_) => _ !== "a" && _ !== "d")
            .join("");
        expect(res).toBe("bbcc");
    });

    it("should use array filter when array and the return it in toArray()", () => {
        const res = from([1, 2, 3, 4])
            .where((_) => _ % 2 === 0)
            .toArray();
        expect(res.length).toBe(2);
    });
});
