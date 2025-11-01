import {doneValue, iteratorResultCreator} from "./utils.ts";
import FluentAsync from "./fluent-async.ts";

export interface SubjectIterator<T> extends AsyncIterator<T> {
    emit(value: T): void;
    complete(): void;
    fail(err: any): void;
}

export class ReplaySubjectAsyncIterator<T> implements SubjectIterator<T> {
    private queue: T[] = [];
    private waiters: {
        resolve: (result: IteratorResult<T>) => void;
        reject: (err: any) => void;
    }[] = [];

    private closed = false;
    private error: any = null;

    public next(): Promise<IteratorResult<T>> {
        if (this.error) {
            return Promise.reject(this.error);
        }

        if (this.queue.length > 0) {
            return Promise.resolve(iteratorResultCreator(this.queue.shift()!));
        }

        if (this.closed) {
            return Promise.resolve(doneValue());
        }

        return new Promise((resolve, reject) => {
            this.waiters.push({ resolve, reject });
        });
    }

    public emit(value: T) {
        if (this.closed || this.error) {
            return;
        }

        if (this.waiters.length) {
            this.waiters.shift()!.resolve(iteratorResultCreator(value));
        } else {
            this.queue.push(value);
        }
    }

    public complete() {
        if (this.closed || this.error) {
            return;
        }
        this.closed = true;

        while (this.waiters.length) {
            this.waiters.shift()!.resolve(doneValue());
        }
    }

    public fail(err: any) {
        if (this.closed || this.error) {
            return;
        }
        this.error = err;
        this.closed = true;
        this.queue = [];

        while (this.waiters.length) {
            this.waiters.shift()!.reject(err);
        }
    }
}

export class SubjectAsyncIterator<T> extends ReplaySubjectAsyncIterator<T> {
    private started = false;

    public next(): Promise<IteratorResult<T>> {
        this.started = true;
        return super.next();
    }

    public emit(value: T) {
        if (!this.started) {
            return;
        }
        super.emit(value);
    }
}

export class FluentAsyncSubject<T> extends FluentAsync<T> implements AsyncDisposable, Disposable {
    private subject: SubjectIterator<T>;

    constructor(iterator?: SubjectIterator<T>) {
        const iter = iterator ?? new SubjectAsyncIterator<T>();
        super({
            [Symbol.asyncIterator]: () => iter,
        });
        this.subject = iter;
    }

    [Symbol.asyncDispose](): PromiseLike<void> {
        this.complete();
        return Promise.resolve();
    }

    [Symbol.dispose](): void {
        this.complete();
    }

    emit(value: T) {
        this.subject.emit(value);
    }

    complete() {
        this.subject.complete();
    }

    fail(err: any) {
        this.subject.fail(err);
    }
}

export class FluentAsyncReplaySubject<T> extends FluentAsyncSubject<T> {
    constructor() {
        super(new ReplaySubjectAsyncIterator<T>());
    }
}
