
import { fromIterable, range } from "../../src";

describe('count tests', () => {

    it('should give number of elements', () => {
        expect(fromIterable([1, 2, 3]).count()).toBe(3);
        expect(range(0, 10).count()).toBe(10);
    });

    it('should give number of elements which satisfy predicate', () => {
        expect(fromIterable([1, 2, 3]).count(_ => _ % 2 === 0)).toBe(1);
        expect(range(0, 10).count(_ => _ % 2 === 0)).toBe(5);
    });
});
