import {describe, expect, it} from "vitest";

import {fromPromises, isFulfilled} from "../../src/index.ts";
import {wait, waitAndReject} from "../test-utils.ts";

describe('from-promises', () => {
    it('should return all results', async () => {
        const promise0 = wait(10, '1');
        const promise1 = wait(20, '2');
        const promise2 = wait(30, '3');

        const results = await fromPromises(promise0, promise1, promise2).where(isFulfilled).select(x => '0' + x.value).toArray();
        expect(results).toStrictEqual(['01', '02', '03']);
    });

    it('should be iterable', async () => {
        const promise0 = wait(10, '1');
        const promise1 = wait(20, '2');
        const promise2 = wait(30, '3');

        const results = fromPromises(promise0, promise1, promise2).where(isFulfilled).select(x => '0' + x.value);
        const values: string[] = [];
        for await (const result of results) {
            values.push(result);
        }
        expect(values).toStrictEqual(['01', '02', '03']);
    });

    it('should have rejected and fulfillment', async () => {
        const promise0 = wait(10, '1');
        const promise1 = waitAndReject(20, '2') as Promise<number>;
        const promise2 = wait(30, '3');

        const results = await fromPromises<string|number>(promise0, promise1, promise2)
            .groupByStatus()
            .toMap(x => x.key);
        expect(results.has('fulfilled')).toBeTruthy();
        expect(results.has('rejected')).toBeTruthy();
        const fulfilled = results.get('fulfilled')!.toArray(x => x.value);
        const rejected = results.get('rejected')!.toArray(x => x.reason);
        expect(fulfilled).toStrictEqual(['1', '3']);
        expect(rejected).toStrictEqual(['2']);
    });
});