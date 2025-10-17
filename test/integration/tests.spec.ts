import { describe, it, expect } from "vitest";

import {
    from,
    fromArrayLike,
    fromIterable,
    fromObject,
    range,
    repeat,
} from "../../index.ts";
import { Person, Pet } from "../unit/models.ts";

describe("typescript tests", () => {
    it("typescript test 0", () => {
        const res = range(0, 10)
            .where((_) => _ % 2 === 1)
            .select((_) => _ * 2)
            .groupBy(
                (_) => _ > 6,
                (_) => _,
                (key, items) => ({ key, items: Array.from(items) }),
            )
            .toArray();
        expect(res).toEqual([
            { key: false, items: [2, 6] },
            { key: true, items: [10, 14, 18] },
        ]);
    });

    it("typescript test 1", () => {
        const input = [
            new Person(10, "A", [new Pet("a0", "A")]),
            new Person(20, "B", [new Pet("b0", "B"), new Pet("b1", "B")]),
            new Person(30, "C", []),
            new Person(40, "D", [new Pet("c0", "C")]),
            new Person(10, "E", [
                new Pet("e0", "E"),
                new Pet("e1", "E"),
                new Pet("e1", "E"),
            ]),
            new Person(30, "G", []),
            new Person(70, "D", [new Pet("d0", "D")]),
            new Person(30, "J", [new Pet("j0", "J")]),
        ];
        const res = from(input)
            .selectMany(
                (_) => _.pets!,
                (o, p) => ({ owner: o, pet: p }),
            )
            .groupBy((_) => _.owner.age)
            .select((gr) => ({
                age: gr.key,
                countPets: from(gr).count(),
            }))
            .orderBy((_) => _.age)
            .toMap(
                (_) => _.age,
                (_) => _.countPets,
            );
        expect(Array.from(res.entries())).toEqual([
            [10, 4],
            [20, 2],
            [30, 1],
            [40, 1],
            [70, 1],
        ]);
    });

    it("fromIterable", () => {
        const res = Array.from(fromIterable(new Set([0, 1, 2, 3])));
        expect(res).toEqual([0, 1, 2, 3]);
    });

    it("fromObject", () => {
        const res0 = Array.from(fromObject({ a: 1, 2: "b" }));
        expect(res0).toEqual([
            { key: "2", value: "b" },
            { key: "a", value: 1 },
        ]);

        const res1 = Array.from(fromObject({ a: 1, 2: "b" }, (k, v) => [k, v]));
        expect(res1).toEqual([
            ["2", "b"],
            ["a", 1],
        ]);
    });

    it("fromArrayLike", () => {
        const res = Array.from(
            fromArrayLike({ 0: "a", 1: "b", 2: "c", length: 3 }),
        );
        expect(res).toEqual(["a", "b", "c"]);
    });

    it("from", () => {
        const resIterable = Array.from(from(new Set([1, 2, 3])));
        expect(resIterable).toEqual([1, 2, 3]);

        const resObject = Array.from(from({ 1: "a", 2: "b" }));
        expect(resObject).toEqual([
            { key: "1", value: "a" },
            { key: "2", value: "b" },
        ]);

        const resArrayLike = Array.from(
            from({ 0: "a", 1: "b", 2: "c", length: 3 }),
        );
        expect(resArrayLike).toEqual(["a", "b", "c"]);
    });

    it("range", () => {
        const resIncrease = Array.from(range(1, 4));
        expect(resIncrease).toEqual([1, 2, 3]);

        const resDecrease = Array.from(range(5, 1));
        expect(resDecrease).toEqual([5, 4, 3, 2]);
    });

    it("repeat", () => {
        const repeatNum = Array.from(repeat(1, 4));
        expect(repeatNum).toEqual([1, 1, 1, 1]);

        const repeatStr = Array.from(repeat("a", 2));
        expect(repeatStr).toEqual(["a", "a"]);
    });

    it("where", () => {
        const res = Array.from(range(0, 10).where((_) => _ % 2 === 1));
        expect(res).toEqual([1, 3, 5, 7, 9]);
    });

    it("where type check", () => {
        function isNum(val: string | number): val is number {
            return typeof val === "number";
        }

        const res = Array.from(from([1, "a", 2, "b"]).where(isNum));
        expect(res).toEqual([1, 2]);
    });

    it("select", () => {
        const res = Array.from(range(0, 10).select((_) => _ * 2));
        expect(res).toEqual(
            range(0, 10)
                .toArray()
                .map((_) => _ * 2),
        );
    });

    it("select many", () => {
        const source = {
            0: ["a", "b"],
            1: ["c"],
        };
        const res0 = Array.from(from(source).selectMany((_) => _.value));
        expect(res0).toEqual(["a", "b", "c"]);

        const res1 = Array.from(
            from(source).selectMany(
                (_) => _.value,
                (parent, child) => ({
                    index: parent.key,
                    child: child,
                }),
            ),
        );
        expect(res1).toEqual([
            { index: "0", child: "a" },
            { index: "0", child: "b" },
            { index: "1", child: "c" },
        ]);
    });

    it("take", () => {
        const res = Array.from(from(range(0, 10)).take(3));
        expect(res).toEqual([0, 1, 2]);
    });

    it("take while", () => {
        const res = Array.from(from(range(0, 10)).takeWhile((x, i) => x < 5));
        expect(res).toEqual([0, 1, 2, 3, 4]);
    });

    it("take last", () => {
        const res = Array.from(from(range(0, 10)).takeLast(2));
        expect(res).toEqual([8, 9]);
    });

    it("skip", () => {
        const res = Array.from(from(range(0, 10)).skip(6));
        expect(res).toEqual([6, 7, 8, 9]);
    });

    it("skip while", () => {
        const res = Array.from(from(range(0, 10)).skipWhile((x, i) => x < 8));
        expect(res).toEqual([8, 9]);
    });

    it("skip last", () => {
        const res = Array.from(from(range(0, 10)).skipLast(6));
        expect(res).toEqual([0, 1, 2, 3]);
    });

    it("distinct", () => {
        const res0 = Array.from(repeat("a", 5).distinct());
        expect(res0).toEqual(["a"]);

        const res1 = Array.from(repeat(1, 3).distinct((a, b) => a === b));
        expect(res1).toEqual([1]);
    });

    it("ofType", () => {
        const source = [
            1,
            "a",
            true,
            Symbol.for("b"),
            undefined,
            null,
            () => {
                return 1;
            },
            {},
            false,
        ];
        const resNum = Array.from(from(source).ofType("number"));
        expect(resNum).toEqual([1]);
        const resStr = Array.from(from(source).ofType("string"));
        expect(resStr).toEqual(["a"]);
        const resBool = Array.from(from(source).ofType("boolean"));
        expect(resBool).toEqual([true, false]);
        const resSymbol = Array.from(from(source).ofType("symbol"));
        expect(resSymbol).toEqual([Symbol.for("b")]);
        const resUndefined = Array.from(from(source).ofType("undefined"));
        expect(resUndefined).toEqual([undefined]);
        const resFunc = Array.from(from(source).ofType("function"));
        expect(resFunc).toEqual([source[6]]);
        const resObject = Array.from(from(source).ofType("object"));
        expect(resObject).toEqual([null, {}]);

        function isNum(val: any): val is number {
            return typeof val === "number";
        }

        const resNum0 = Array.from(from(source).ofType(isNum));
        expect(resNum0).toEqual([1]);
    });

    it("ofClass", () => {
        abstract class X {}

        class A extends X {}

        class B {}

        class C extends X {}

        const source = [new A(), new B(), new C()];
        const result = from(source).ofClass(X).toArray();
        expect(result[0] instanceof A).toBe(true);
        expect(result[1] instanceof C).toBe(true);
    });

    it("first", () => {
        expect(from([1, 2, 3]).first()).toBe(1);
        expect(from([]).first()).toBe(undefined);

        expect(from([1, 2, 3]).first((x) => x === 2)).toBe(2);
        expect(from([]).first((x) => x === 10)).toBe(undefined);
        expect(from([1, 2, 3]).first((x) => x === 10)).toBe(undefined);
    });

    it("firstIndex", () => {
        expect(from([1, 2, 3]).firstIndex((x) => x === 3)).toBe(2);
        expect(from([]).firstIndex((x) => x === 3)).toBe(-1);
        expect(from([1, 2, 3]).firstIndex((x) => x === 10)).toBe(-1);
    });

    it("firstOrDefault", () => {
        expect(from([1, 2, 3]).firstOrDefault(5)).toBe(1);
        expect(from<number>([]).firstOrDefault(5)).toBe(5);

        expect(from([1, 2, 3]).firstOrDefault(5, (x) => x === 2)).toBe(2);
        expect(from<number>([]).firstOrDefault(5, (x) => x === 10)).toBe(5);
        expect(from([1, 2, 3]).firstOrDefault(10, (x) => x === 10)).toBe(10);
    });

    it("firstOrThrow", () => {
        expect(from([1, 2, 3]).firstOrThrow()).toBe(1);
        expect(function () {
            from([]).firstOrThrow();
        }).toThrowError(TypeError);

        expect(from([1, 2, 3]).firstOrThrow((x) => x === 2)).toBe(2);
        expect(function () {
            from([]).firstOrThrow((x) => x === 2);
        }).toThrowError(TypeError);
        expect(function () {
            from([1, 2, 3]).firstOrThrow((x) => x === 10);
        }).toThrowError(TypeError);
    });

    it("last", () => {
        expect(from([1, 2, 3]).last()).toBe(3);
        expect(from([]).last()).toBe(undefined);

        expect(from([1, 2, 2, 3]).last((x) => x === 2)).toBe(2);
        expect(from([]).last((x) => x === 10)).toBe(undefined);
        expect(from([1, 2, 3]).last((x) => x === 10)).toBe(undefined);
    });

    it("lastOrDefault", () => {
        expect(from([1, 2, 3]).lastOrDefault(5)).toBe(3);
        expect(from<number>([]).lastOrDefault(5)).toBe(5);

        expect(from([1, 2, 3]).lastOrDefault(5, (x) => x === 2)).toBe(2);
        expect(from<number>([]).lastOrDefault(5, (x) => x === 10)).toBe(5);
        expect(from([1, 2, 3]).lastOrDefault(10, (x) => x === 10)).toBe(10);
    });

    it("lastOrThrow", () => {
        expect(from([1, 2, 3]).lastOrThrow()).toBe(3);
        expect(function () {
            from([]).lastOrThrow();
        }).toThrowError(TypeError);

        expect(from([1, 2, 3]).lastOrThrow((x) => x === 2)).toBe(2);
        expect(function () {
            from([]).lastOrThrow((x) => x === 2);
        }).toThrowError(TypeError);
        expect(function () {
            from([1, 2, 3]).lastOrThrow((x) => x === 10);
        }).toThrowError(TypeError);
    });

    it("lastIndex", () => {
        expect(from([1, 2, 3, 2, 3]).lastIndex((x) => x === 3)).toBe(4);
        expect(from([]).lastIndex((x) => x === 3)).toBe(-1);
        expect(from([1, 2, 3]).lastIndex((x) => x === 10)).toBe(-1);
    });

    it("intersect", () => {
        expect(
            from(new Set([1, 2, 3]))
                .intersect([3, 2])
                .toArray(),
        ).toEqual([2, 3]);
        expect(from([1, 2, 3, 2]).intersect([3, 2, 3]).toArray()).toEqual([
            2, 3,
        ]);
        expect(
            from([1, 2, 3, 2])
                .intersect([3, 2, 3])
                .toArray(),
        ).toEqual([2, 3]);
    });
});
