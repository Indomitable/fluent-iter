import {delay as sleep} from "../utils.ts";

export default function fromTimerAsync(interval: number, delay?: number): AsyncIterable<number> & AsyncDisposable {
    let done = false;
    return {
        [Symbol.asyncIterator]: async function* () {
            let i = 0;
            if (delay) {
                await sleep(delay);
                if (done) {
                    return;
                }
                yield i++;
            }
            while (true) {
                if (done) {
                    break;
                }
                await sleep(interval);
                yield i++;
            }
        },
        [Symbol.asyncDispose]() {
            done = true;
            return Promise.resolve();
        }
    }
}
