import {expect, describe, it} from "vitest";
import {FluentAsyncReplaySubject, FluentAsyncSubject} from "../../src/fluent-async-subject.ts";

describe('FluentAsyncReplaySubject', () => {
   it('should emit values to array', async () => {
       const subject = new FluentAsyncReplaySubject<number>();
       subject.emit(1);
       subject.emit(2);
       subject.complete();
       const values = await subject.toArray();
       expect(values).toStrictEqual([1, 2]);
   });

    it('should emit values', async () => {
        const subject = new FluentAsyncReplaySubject<number>();
        const values: number[] = [];
        let i = 1;
        subject.emit(i);
        for await (const value of subject) {
            values.push(value);
            i++;
            if (i === 5) {
                subject.complete();
            }
            subject.emit(i);
        }
        expect(values).toStrictEqual([1, 2, 3, 4]);
    });

    it('should process values emitted before complete and ignore the rest.', async () => {
        const subject = new FluentAsyncReplaySubject<number>();
        const values: number[] = [];
        let i = 1;
        setTimeout(() => {
            subject.emit(i);
        }, 1);
        for await (const value of subject) {
            values.push(value);
            i++;
            if (i === 5) {
                subject.complete();
            }
            subject.emit(i);
            subject.emit(i);
        }
        expect(values).toStrictEqual([1, 2, 2, 3, 3, 4, 4]);
    });

    it('should be fluent iterable.', async () => {
        const subject = new FluentAsyncReplaySubject<number>();
        const values: number[] = [];
        let i = 1;
        subject.emit(i);
        for await (const value of subject.select(x => x * 2).take(3)) {
            values.push(value);
            i++;
            if (i === 5) {
                subject.complete();
            }
            subject.emit(i);
            subject.emit(i);
        }
        // from first 3 emitted values: 1, 2, 2, multiply by 2.
        expect(values).toStrictEqual([2, 4, 4]);
    });

    it('should return values for each next call', async () => {
        const subject = new FluentAsyncReplaySubject<number>();
        const iterator = subject[Symbol.asyncIterator]();
        setTimeout(() => {
            subject.emit(1);
            subject.emit(2);
            subject.complete();
        }, 1);
        const p0 = iterator.next();
        const p1 = iterator.next();
        const p2 = iterator.next();

        const [r0, r1, r2] = await Promise.all([p0, p1, p2]);

        expect(r0.value).toBe(1);
        expect(r1.value).toBe(2);
        expect(r2.done).toBe(true);
    });

    it('should be async disposable.', async () => {
        const f = async () => {
            await using subject = new FluentAsyncReplaySubject<number>();
            subject.emit(1);
            subject.emit(2);
            return subject;
        }

        const subject = await f();
        const values: number[] = [];
        for await (const value of subject) {
            values.push(value);
        }
        expect(values).toStrictEqual([1, 2]);
    });

    it('should be disposable.', async () => {
        const f = () => {
            using subject = new FluentAsyncReplaySubject<number>();
            subject.emit(1);
            subject.emit(2);
            return subject;
        }

        const subject = f();
        const values: number[] = [];
        for await (const value of subject) {
            values.push(value);
        }
        expect(values).toStrictEqual([1, 2]);
    });
});

describe('FluentAsyncSubject', () => {
    it('should not return anything if completed before started', async () => {
        const subject = new FluentAsyncSubject<number>();
        subject.emit(1);
        subject.emit(2);
        subject.complete();
        const values = await subject.toArray();

        expect(values).toStrictEqual([]);
    });

    it('should return values emitted after start', async () => {
        const subject = new FluentAsyncSubject<number>();
        subject.emit(1);

        const values: number[] = [];
        setTimeout(() => {
            subject.emit(2);
        }, 1);
        for await (const value of subject) {
            values.push(value);
            subject.complete();
        }
        expect(values).toStrictEqual([2]);
    });
});
