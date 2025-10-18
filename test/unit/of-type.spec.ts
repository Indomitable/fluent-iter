import { describe, it, expect } from "vitest";
import { fromIterable, from } from "../../index.ts";

describe("oftype tests", () => {
    it("should check for primary types", () => {
        const source = [1, 2, 3, "a", 4, 5, "s", true, "c", false];
        const inputNumber = fromIterable(source).ofType("number");
        expect(Array.from(inputNumber)).toEqual([1, 2, 3, 4, 5]);
        const inputStr = fromIterable(source).ofType("string");
        expect(Array.from(inputStr)).toEqual(["a", "s", "c"]);

        const inputBool = fromIterable(source).ofType("boolean");
        expect(Array.from(inputBool)).toEqual([true, false]);
    });

    it("should check for function types", () => {
        class A {}

        class B {}

        const source = [new A(), new B()];
        const result = fromIterable(source).ofClass(A);
        const arr = Array.from(result);
        expect(arr.length).toBe(1);
        expect(arr.every((_) => _ instanceof A)).toBe(true);
    });

    it("should check for type using function", () => {
        class A {}

        class B {}

        const source = [new A(), new B()];
        const result = from(source)
            .ofType((_) => _ instanceof A)
            .toArray();
        expect(result[0]).toBe(source[0]);
    });
});
