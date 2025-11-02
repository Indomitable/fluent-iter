import { describe, it, expect } from "vitest";
import {from, fromIterable} from "../../src/index.ts";

describe("all tests", () => {
    [["a", "b", "c"], new Set(["a", "b", "c"])].forEach((source, indx) => {
        it("should return true if all items pass: " + indx, () => {
            const input = fromIterable(source);
            expect(input.all((_) => typeof _ === "string")).toBe(true);
        });
    });

    [["a", "b", 1], new Set(["a", "b", 1])].forEach((source, indx) => {
        it("should return false if some items do not pass: " + indx, () => {
            const input = fromIterable(source);
            expect(input.all((_) => typeof _ === "string")).toBe(false);
        });
    });

    [[], new Set()].forEach((source, indx) => {
        it("should return true if no items: " + indx, () => {
            const input = fromIterable(source);
            expect(input.all((_) => typeof _ === "string")).toBe(true);
        });
    });

    [[1, 2, 3, 4, 5], new Set([1, 2, 3, 4, 5])].forEach((source, indx) => {
        it("should allAndEvery return true if all items pass: " + indx, () => {
            const input = fromIterable(source);
            expect(input.allAndEvery((_) => typeof _ === "number")).toBe(true);
        });
    });

    [["a", "b", 1], new Set(["a", "b", 1])].forEach((source, indx) => {
        it(
            "should allAndEvery return false if some items do not pass: " +
                indx,
            () => {
                const input0 = fromIterable(source);
                expect(input0.allAndEvery((_) => typeof _ === "string")).toBe(false);
            },
        );
    });

    [[], new Set()].forEach((source, indx) => {
        it("should allAndEvery return false if no items: " + indx, () => {
            const input = fromIterable(source);
            expect(input.allAndEvery((_) => typeof _ === "string")).toBe(false);
        });
    });

    it('should work alias', () => {
        expect(from([1, 2, 3]).every(x => x > 0)).toBe(true);
        expect(from([1, 2, 3]).every(x => x > 2)).toBe(false);
        expect(from([]).every(x => x > 2)).toBe(true);
    });
});
