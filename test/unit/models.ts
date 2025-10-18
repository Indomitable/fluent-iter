export class Person {
    constructor(public age: number, public name: string, public pets?: Pet[]) {
    }
}

export class Pet {
    constructor(public name: string, public owner: string) {
    }
}
