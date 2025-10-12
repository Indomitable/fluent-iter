
import { from, fromIterable, range } from "../../src";

describe('skip tests', () => {
    [
        [1, 2, 3, 4, 5],
        range(1, 6)
    ].forEach((source, indx) => {
        it('should skip first n numbers: ' + indx, () => {
            const output = fromIterable(source).skip(2).toArray();
            expect(output).toEqual([3, 4, 5]);
        });
    });

    [
        [1, 2, 3, 4, 5],
        range(1, 6)
    ].forEach((source, indx) => {
        it('should skip first n numbers after another operation: ' + indx, () => {
            const output = fromIterable(source).where(_ => _ > 2).skip(2).toArray();
            expect(output).toEqual([5]);
        });
    });

    [
        [1, 2, 3, 4, 5],
        range(1, 6)
    ].forEach((source, indx) => {
        it('should skip be able to continue with another operator: ' + indx, () => {
            const output = fromIterable(source)
                .where(_ => _ > 2)
                .skip(1)
                .select(x => `item_${x}`)
                .toArray();
            expect(output).toEqual(['item_4', 'item_5']);
        });
    });

    [
        [1, 2],
        range(1, 3)
    ].forEach((source, indx) => {
        it('should skip return nothing if count is less: ' + indx, () => {
            // use array
            const res = fromIterable(source)
                .skip(3)
                .toArray();
            expect(res).toEqual([]);
        });
    });

    [
        [],
        new Set()
    ].forEach((source, indx) => {
        it('should skip return empty from empty collection: ' + indx, () => {
            const output = fromIterable(source)
                .skip(2)
                .toArray();
            expect(output).toEqual([]);
        });
    });

    [
        [1, 2, 3, 4, 5],
        range(1, 6)
    ].forEach((source, indx) => {
        it('should return all when none to be skipped' + indx, () => {
            expect(from(source).skip(0).toArray()).toEqual([1, 2, 3, 4, 5]);
            expect(from(source).skip(-1).toArray()).toEqual([1, 2, 3, 4, 5]);
        });
    });
});
