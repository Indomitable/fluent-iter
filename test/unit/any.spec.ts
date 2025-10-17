import { describe, it, expect } from "vitest";
import { from, fromIterable } from "../../src/index.ts";

describe("any tests", () => {
    [["a", 1, "c"], new Set(["a", 1, "c"])].forEach((source, indx) => {
        it("should return true if at least one item pass: " + indx, () => {
            const res = fromIterable(source).any((_) => typeof _ === "number");
            expect(res).toBe(true);
        });
    });

    [[], new Set()].forEach((source, indx) => {
        it("should return false if no items: " + indx, () => {
            const res = fromIterable(source).any((_) => typeof _ === "string");
            expect(res).toBe(false);
        });
    });

    [[1, 2, 3], new Set([1, 2, 3])].forEach((source, indx) => {
        it("should return false if no items pass: " + indx, () => {
            const res = fromIterable(source).any((_) => typeof _ === "string");
            expect(res).toBe(false);
        });
    });

    it("should any check if elements", () => {
        expect(from([1]).any()).toBe(true);
        expect(from([]).any()).toBe(false);
        expect(from(new Set([1])).any()).toBe(true);
        expect(from(new Set()).any()).toBe(false);
    });
});
