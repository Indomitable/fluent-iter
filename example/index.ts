import {range, from} from "fluent-iter";

range(0, 30)
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
        items: from(_).orderByDescending(_ => _.num).toArray()
    }))
    .orderBy(_ => _.key)
    .forEach(x => console.log(x));
