Fluent-Iter
-------
Fluent-Iter is a library that allows you to work with iterables in a fluent way.
It is full written in TypeScript and has no dependencies.

Examples:
```js
const query = fromIterable([1, 2, 3, 4, 5, 6, 7])
               .where(_ => _ % 2 === 0)
               .select(_ => _ * 2);
```
```js 
const query = range(0, 30)
            .select(i => i * 3)
            .where(i => i > 10)
            .select(i =>
                ({
                    odd: i % 2 === 1,
                    even: i % 2 === 0,
                    num: i
                })
            )
            .skip(1)
            .take(4)
            .groupBy(i => i.odd)
            .select(_ => ({
                key: _.key,
                items: _.orderByDescending(_ => _.num).toArray()
            }))
            .orderBy(_ => _.key);
```

To consume the data we can use:
```js
const arr = query.toArray();
const arr = Array.from(query); 
for (const item of query) {
    console.log(item); // Prints 4, 8, 12
}
```
Remarks:

1. The data is processed at the moment when is requested.
2. The sequence is immutable the output !== input  

Operators:

Transformers
- where : filter iterable by predicate
- filter : alias for where
- select : transform iterable using mapping function
- map : alias for select
- selectMany : flatten an iterable and can transform it to another iterable
- flat: flatten an iterable up to N levels, default is 1 level
- flatMap: flatten an iterable one level and maps inner elements
- ofType : produces typed iterable, used to filter by type
- ofClass: filters iterable for elements of a given class
- groupBy: group items by a key
- orderBy : Order iterable ascending by a key
- orderByDescending : Order iterable descending by a key
- groupJoin: Do a group join (left join) between current and external iterable. For each item of current sequence get array of items from external sequence.
- join: Do an inner join between current and external sequence. For each item of current sequence get a item from external sequence.
- page: Split iterable into chunks of a given size.
- reverse: Reverse iterable.

Slicing
- take : take first n elements
- takeWhile : take elements while predicate is true
- takeLast : take last n elements
- skip : skip first n elements
- skipWhile : skip elements while predicate is true
- skipLast : skip last n elements

Combinations:
- concat: Concat this iterable with another
- distinct: removes duplicate elements
- zip: zip two iterables together, where the result is an iterable of tuples, finishes when one of the iterables is finished.
- union: Produce a union of two iterables where the result is distinct values from both.
- intersect: Return an intersection of two iterables where the result is distinct values.
- difference: Return elements from the first iterable that are not in the second. Only distinct values are returned.
- symmetricDifference: Return a symmetric difference ( distinct values except intersection ) of two iterables where the result is distinct values.

Aggregators:
- toArray(): convert iterable to array
- toMap(): Create a map object from sequence
- toSet(): Creates a set from current sequence
- first : first element in iterable or first element that satisfies predicate
- find: alias for first
- firstOrDefault: like first but with default value
- firstOrThrow: like first but throws if no element is found
- firstIndex: like first but returns index of element
- findIndex: alias for firstIndex
- last: last element in iterable or last element that satisfies predicate
- findLast: alias for last
- lastOrDefault: like last but with default value
- lastOrThrow: like last but throws if no element is found
- lastIndex: like last but returns index of element
- findLastIndex: alias for lastIndex
- single: single element in iterable or single element that satisfies predicate. Throws if more than one element is found.
- singleOrDefault: like single but with default value when nothing found. Throws if more than one element is found.
- all: check if all elements in iterable satisfy predicate
- every: alias for all
- allAndEvery: like all but requires to have at least one element
- any: check if at least one element in iterable satisfies predicate
- some: alias for any
- count: count elements in iterable or count of elements that satisfy predicate
- aggregate: Produce single value form sequence values. The initial value is the second argument.
- reduce: alias for aggregate
- sum: Sum all elements in iterable
- product: Multiply all elements in iterable
- min: Get minimum value in iterable
- max: Get maximum value in iterable
- join: join all items from iterable with string concatenation
- elementAt: get element at index
- at: alias for elementAt

Misc:
- forEach: iterate over iterable and execute a function for each element
- isEqual: check if two iterables are equal. Same elements and order.
- isElementsEqual: check if two iterables are equal. Same elements but order can be different.