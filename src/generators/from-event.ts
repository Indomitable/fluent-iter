import {doneValue, iteratorResultCreator} from "../utils.ts";

export default function fromEventAsync<TTarget extends EventTarget, TEvent extends keyof HTMLElementEventMap>(target: TTarget, event: TEvent): AsyncIterable<HTMLElementEventMap[TEvent]> & AsyncDisposable {
    const eventQueue: HTMLElementEventMap[TEvent][] = [];
    const resolverQueue: ((result: IteratorResult<HTMLElementEventMap[TEvent]>) => void)[] = [];

    const eventHandler = (e: Event) => {
        const eventValue = e as HTMLElementEventMap[TEvent];

        const nextResolver = resolverQueue.shift();
        if (nextResolver) {
            nextResolver(iteratorResultCreator(eventValue));
        } else {
            eventQueue.push(eventValue);
        }
    };

    target.addEventListener(event, eventHandler);
    return {
        [Symbol.asyncIterator]() {
            return {
                next(): Promise<IteratorResult<HTMLElementEventMap[TEvent]>> {
                    const nextEvent = eventQueue.shift();
                    if (nextEvent) {
                        return Promise.resolve(iteratorResultCreator(nextEvent));
                    }

                    return new Promise((resolve) => {
                        resolverQueue.push(resolve);
                    });
                },

                return(): Promise<IteratorResult<HTMLElementEventMap[TEvent]>> {
                    target.removeEventListener(event, eventHandler);
                    resolverQueue.length = 0;
                    return Promise.resolve(doneValue());
                },
                throw(error: any) {
                    target.removeEventListener(event, eventHandler);
                    resolverQueue.length = 0;
                    return Promise.reject(error);
                }
            };
        },
        [Symbol.asyncDispose]: () => {
            target.removeEventListener(event, eventHandler);
            resolverQueue.length = 0;
            return Promise.resolve();
        }
    };
}