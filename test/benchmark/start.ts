import * as benchmarks from "./export.ts";
import { from } from "../../index.ts";

import Benchmark from "benchmark";

const suit = new Benchmark.Suite("fluent-iter bechrmark tests");

const suitParamIndex = process.argv.indexOf("--suit");
let suitName = "";
if (suitParamIndex > -1) {
    suitName = process.argv[suitParamIndex + 1];
}

const regEx = new RegExp("^\\[(.+)]\\s(.+)$");
Object.values(benchmarks).forEach((bench) => {
    const benchSuit = regEx.exec(bench.name!)![1];
    if (!suitName || benchSuit === suitName) {
        suit.add(bench.name!, bench.fn);
    }
});

interface BenchData {
    category: string;
    name: string;
    bench: Benchmark;
}

suit.on("complete", function (this: Benchmark[]) {
    const formatNumber = (num: string) => {
        if (num.indexOf(".") > -1 || num.length < 4) {
            return num;
        }
        return from(num)
            .reverse()
            .page(3)
            .where((_) => !!_)
            .groupBy(
                (_, i) => i,
                (_) => _.reverse().join(""),
                (_, items) => items.first(),
            )
            .reverse()
            .join(",");
    };

    const benchFormat = (bench: { name: string, ops: string, error: number }, showError?: boolean) => {
        if (showError) {
            return `${bench.name} (${formatNumber(bench.ops)} op/sec) error margin: \xb1${bench.error.toFixed(2)}%`;
        } else {
            return `${bench.name} (${formatNumber(bench.ops)} op/sec)`;
        }
    };

    const getBenchData = (_: BenchData) => {
        return {
            name: _.name!,
            ops: _.bench.hz.toFixed(_.bench.hz < 100 ? 2 : 0),
            error: _.bench.stats.rme,
        };
    };

    const benchCategories = from(this)
        .select((b) => {
            const match = regEx.exec(b.name!)!;
            return {
                category: match[1]!,
                name: match[2]!,
                bench: b,
            } as BenchData;
        })
        .groupBy(
            (_) => _.category,
            (_) => _,
            (key, items) => {
                const fastestBench = items.max(
                    (a, b) => a.bench.hz - b.bench.hz,
                );
                return {
                    name: key,
                    fastest: getBenchData(fastestBench),
                    benches: items
                        .orderByDescending((_) => _.bench.hz)
                        .select(getBenchData),
                };
            },
        );

    for (const category of benchCategories) {
        console.log(
            `\n${category.name} benchmark: Fastest method: ${benchFormat(category.fastest)}`,
        );
        for (const bench of category.benches) {
            const slower = (+category.fastest.ops / +bench.ops).toFixed(2);
            console.log(
                `\t${benchFormat(bench, true)}, slower: ${slower} times`,
            );
        }
    }
    console.log("\n");
}).run({ async: true });
