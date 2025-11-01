export function wait<T>(ms: number, result: T): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(result);
        }, ms);
    });
}

export function waitAndReject(ms: number, reason: any): Promise<any> {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(reason);
        }, ms);
    });
}