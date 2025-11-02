import {delay as sleep} from "../utils.ts";

export default function fromTimerAsync(interval: number, delay?: number): AsyncIterable<number> & AsyncDisposable & Disposable {
    const abortController = new AbortController();
    const {signal} = abortController;
    return {
        [Symbol.asyncIterator]: async function* () {
            try {
                let i = 0;
                if (delay) {
                    await sleep(delay, signal);
                    if (signal.aborted) {
                        return;
                    }
                    yield i++;
                }
                while (true) {
                    if (signal.aborted) {
                        break;
                    }
                    await sleep(interval, signal);
                    yield i++;
                }
            } catch {
                // ignore aborted errors
            }
        },
        [Symbol.asyncDispose]() {
            abortController.abort('fromTimerAsync disposed async');
            return Promise.resolve();
        },
        [Symbol.dispose]() {
            abortController.abort('fromTimerAsync disposed');
        }
    }
}
