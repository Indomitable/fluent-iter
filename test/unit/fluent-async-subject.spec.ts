import {expect, describe, it} from "vitest";
import {FluentAsyncSubject} from "../../src/fluent-async-subject.ts";

describe('FluentAsyncSubject', () => {
   it('should emit values to array', async () => {
       const subject = new FluentAsyncSubject<number>();
       subject.emit(1);
       subject.emit(2);
       subject.complete();
       const values = await subject.toArray();
       expect(values).toStrictEqual([1, 2]);
   });

    it('should emit values', async () => {
        const subject = new FluentAsyncSubject<number>();
        subject.emit(1);
        subject.emit(2);
        subject.complete();
        const values: number[] = [];
        for await (const value of subject) {
            values.push(value);
        }
        expect(values).toStrictEqual([1, 2]);
    });
});