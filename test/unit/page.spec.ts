import { describe, it, expect } from "vitest";
import {from, fromTimer, range} from "../../src/index.ts";
import {emptyAsyncIterable} from "../test-utils.ts";

describe('page iteration tests', () => {
    [
        range(0, 105),
        Array.from(range(0, 105))
    ].forEach((source, indx) => {
        it('should page iterable: ' + indx, () => {
            const res = from(source).page(20).toArray();
            expect(res.length).toBe(6);
            expect(res).toEqual([
                Array.from(range(0, 20)),
                Array.from(range(20, 40)),
                Array.from(range(40, 60)),
                Array.from(range(60, 80)),
                Array.from(range(80, 100)),
                Array.from(range(100, 105)),
            ])
        })
    });

    it('should page string', () => {
        const res = from('abcdefd').page(3)
            .groupBy((arr, i) => i, _ => _, (key, items) => items.firstOrThrow().join(''))
            .join(',');
        expect(res).toBe('abc,def,d');
    });

    it('should page when mod pageSize === 0', () => {
        const res0 = from(range(0, 20)).page(5).toArray();
        expect(res0.length).toBe(4);
        const res1 = from('abcdef').page(3).toArray();
        expect(res1.length).toBe(2);
    });
});

describe('page async tests', () => {
   it('should page async iterable', async () => {
       let i = 0;
       for await (const page of fromTimer(1).take(10).page(4)) {
           switch (i) {
               case 0: {
                   expect(page).toStrictEqual([0, 1, 2, 3]);
                   break;
               }
               case 1: {
                   expect(page).toStrictEqual([4, 5, 6, 7]);
                   break;
               }
               case 2: {
                   expect(page).toStrictEqual([8, 9])
               }
           }
           i++;
       }
       expect(i).toBe(3);
   });

   it('should return empty array when no items', async () => {
       const res = await from(emptyAsyncIterable).page(4).toArray();
       expect(res).toStrictEqual([]);
   })
});