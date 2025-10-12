
import { fromIterable } from "../../src";
import { Person } from "./models";

describe('for each tests', () => {

    [
        new Set([
            new Person(10, 'A'),
            new Person(20, 'B'),
            new Person(30, 'C'),
        ]),
        [
            new Person(10, 'A'),
            new Person(20, 'B'),
            new Person(30, 'C'),
        ]
    ].forEach((source, indx) => {
        it('should do for each items in sequence: ' + indx, () => {
            fromIterable(source).forEach(p => {
                p.age = p.age * 2;
            });
            expect(fromIterable(source).elementAt(0).age).toBe(20);
            expect(fromIterable(source).elementAt(1).age).toBe(40);
            expect(fromIterable(source).elementAt(2).age).toBe(60);
        });
    });


    [
        new Set([
            new Person(10, 'A'),
            new Person(20, 'B'),
            new Person(30, 'C'),
        ]),
        [
            new Person(10, 'A'),
            new Person(20, 'B'),
            new Person(30, 'C'),
        ]
    ].forEach((source, indx) => {
        it('should do for each items in sequence after other functions: ' + indx, () => {
            fromIterable(source).where(p => p.age > 10).forEach(p => {
                p.age = p.age * 2;
            });
            expect(fromIterable(source).elementAt(0).age).toBe(10);
            expect(fromIterable(source).elementAt(1).age).toBe(40);
            expect(fromIterable(source).elementAt(2).age).toBe(60);
        });
    });

});
