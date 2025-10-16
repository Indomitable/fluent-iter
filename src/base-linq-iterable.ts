// import { InternalIterable } from "./interfaces.ts";
// import { getIterator } from "./utils.ts";
//
// export abstract class BaseLinqIterable<T, R> {
//     #source: InternalIterable<T>;
//     constructor(source: InternalIterable<T>) {
//         this.#source = source;
//     }
//
//     _getIterator<T>(source: Iterable<T>) {
//         return getIterator(source);
//     }
//
//     protected _getSourceIterator() {
//         return getIterator(this._getSource());
//     }
//
//     protected _getSource() {
//         return this.#source.get();
//     }
//
//     abstract get(): InternalIterable<R> | R[];
// }
//
// export abstract class NativeProcessingLinqIterable<T, R> extends BaseLinqIterable<T, R> {
//     constructor(source: InternalIterable<T>) {
//         super(source);
//     }
//
//     protected abstract _nativeTake(array: T[]): R[];
//
//     protected _tryNativeProcess() {
//         const source = this._getSource();
//         if (Array.isArray(source)) {
//             const result = this._nativeTake(source);
//             if (result) {
//                 return { processed: result };
//             }
//         }
//         return { source };
//     }
//
//     override get(): InternalIterable<R> | R[] {
//         const { processed } = this._tryNativeProcess();
//         if (processed) {
//             return processed;
//         }
//         return this as unknown as InternalIterable<R>;
//     }
// }
