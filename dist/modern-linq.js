function st(n, t) {
  const e = Object.keys(n);
  for (const r of t)
    for (const s of e)
      r.prototype[s] || (r.prototype[s] = n[s]);
}
function l(n) {
  return n[Symbol.iterator]();
}
function k(n, t, e, r) {
  do {
    let s = t, o = e, i = n[s + (o - s >> 1)];
    do {
      for (; s < n.length && r(i, n[s]) > 0; ) s++;
      for (; o >= 0 && r(i, n[o]) < 0; ) o--;
      if (s > o) break;
      s < o && ([n[s], n[o]] = [n[o], n[s]]), s++, o--;
    } while (s <= o);
    o - t <= e - s ? (t < o && k(n, t, o, r), t = s) : (s < e && k(n, s, e, r), e = o);
  } while (t < e);
}
function ot(n, t, e, r) {
  const s = [...n];
  return k(s, t, e, r), s;
}
class it {
  constructor() {
    this.set = /* @__PURE__ */ new Set();
  }
  tryAdd(t) {
    const e = this.set.size;
    return this.set.add(t), this.set.size > e;
  }
  clear() {
    this.set.clear();
  }
}
function A(n, t) {
  return n < t ? -1 : n > t ? 1 : 0;
}
function C(n, t) {
  return n === t;
}
function E(n) {
  return n;
}
function c() {
  return { done: !0 };
}
function f(n) {
  return { done: !1, value: n };
}
function ut() {
  return {
    next() {
      return c();
    }
  };
}
class L {
  constructor(t) {
    this.source = t;
  }
  [Symbol.iterator]() {
    return l(this.source);
  }
  get() {
    return this;
  }
}
class at {
  static get(t, e) {
    if (e)
      return t.select(e).toArray();
    {
      const r = t.get();
      return Array.isArray(r) ? r : Array.from(r);
    }
  }
}
class R {
  static get(t, e) {
    return e ? t.get().map(e) : t.get();
  }
}
class m {
  /**
   *
   * @param {Iterable} source
   * @param {Function} predicate
   */
  constructor(t, e) {
    this.source = t, this.predicate = e;
  }
  static __findNext(t, e) {
    let r = !1;
    for (; !r; ) {
      const s = t.next();
      if (!s.done && e(s.value))
        return f(s.value);
      r = s.done;
    }
    return c();
  }
  [Symbol.iterator]() {
    const t = l(this.source.get()), e = this.predicate;
    return {
      next() {
        return m.__findNext(t, e);
      }
    };
  }
  get() {
    return this;
  }
}
class N {
  constructor(t, e) {
    this.array = t, this.predicate = e;
  }
  [Symbol.iterator]() {
    const t = this.get();
    return l(t);
  }
  get() {
    return this.array.filter((t) => this.predicate(t));
  }
  toArray(t) {
    return R.get(this, t);
  }
}
class ct {
  static create(t, e) {
    const r = t.get();
    return Array.isArray(r) ? new N(r, e) : new m(r, e);
  }
}
class D {
  constructor(t) {
    this.array = t;
  }
  [Symbol.iterator]() {
    return l(this.array);
  }
  get() {
    return this.array;
  }
  where(t) {
    return new N(this.array, t);
  }
  toArray(t) {
    return R.get(this, t);
  }
}
class F {
  constructor(t) {
    this.source = t;
  }
  get() {
    return Array.isArray(this.source) ? this.source : this;
  }
  [Symbol.iterator]() {
    if (Array.isArray(this.source))
      return l(this.source);
    const t = this.source.length, e = this.source;
    let r = 0;
    return {
      next() {
        if (r < t) {
          const s = e[r];
          return r++, f(s);
        } else
          return c();
      }
    };
  }
}
class S {
  constructor(t, e) {
    this.source = t, this.resultCreator = typeof e > "u" ? S.__defaultResultCreator : e;
  }
  static __defaultResultCreator(t, e) {
    return { key: t, value: e };
  }
  [Symbol.iterator]() {
    const t = this.source, e = this.resultCreator, r = Object.keys(t);
    let s = 0;
    return {
      next() {
        if (s < r.length) {
          const o = r[s], i = t[o];
          return s++, f(e(o, i));
        } else
          return c();
      }
    };
  }
  get() {
    return this;
  }
}
class h {
  constructor(t) {
    this.source = t;
  }
  _getIterator(t) {
    return l(t);
  }
  _getSourceIterator() {
    return l(this._getSource());
  }
  _getSource() {
    return this.source.get();
  }
  get() {
    return this;
  }
}
class I extends h {
  constructor(t) {
    super(t);
  }
  _nativeTake(t) {
    throw new Error("Not implemented");
  }
  _tryNativeProcess() {
    const t = this._getSource();
    if (Array.isArray(t)) {
      const e = this._nativeTake(t);
      if (e)
        return { processed: e };
    }
    return { source: t };
  }
  get() {
    const { processed: t } = this._tryNativeProcess();
    return t || this;
  }
}
class z extends I {
  /**
   *
   * @param {Iterable} source
   * @param {Function} map
   */
  constructor(t, e) {
    super(t), this.map = e;
  }
  _nativeTake(t) {
    return t.map(this.map);
  }
  [Symbol.iterator]() {
    const { processed: t, source: e } = this._tryNativeProcess();
    if (t)
      return this._getIterator(t);
    const r = this._getIterator(e), s = this.map;
    return {
      next() {
        const { done: o, value: i } = r.next();
        return o ? {
          done: !0
        } : {
          done: !1,
          value: s(i)
        };
      }
    };
  }
}
class g extends h {
  /**
   *
   * @param {Iterable} source
   * @param {Function} extract
   */
  constructor(t, e, r) {
    super(t), this.innerSelector = e, this.resultCreator = typeof r > "u" ? g.__defaultResultCreator : r;
  }
  static __defaultResultCreator(t, e) {
    return e;
  }
  [Symbol.iterator]() {
    const t = this._getSource(), e = this._getIterator(t), r = this.innerSelector, s = this.resultCreator;
    let o = null;
    return {
      next() {
        const i = g.__getNextItem(e, r, o);
        return i.done ? c() : (o = i.currentState, f(s(o.outerValue, i.innerValue)));
      }
    };
  }
  static __getInnerIterator(t, e) {
    const r = t.next();
    if (r.done)
      return {
        final: !0
      };
    const s = l(e(r.value)), o = s.next();
    return o.done ? g.__getInnerIterator(t, e) : {
      current: {
        outerValue: r.value,
        innerIterator: s
      },
      firstInnerItem: o.value,
      final: !1
    };
  }
  static __getNextItem(t, e, r) {
    if (r) {
      const s = r.innerIterator.next();
      return s.done ? g.__getNextItem(t, e, null) : {
        innerValue: s.value,
        currentState: {
          innerIterator: r.innerIterator,
          outerValue: r.outerValue
        }
      };
    } else {
      const { current: s, firstInnerItem: o, final: i } = g.__getInnerIterator(t, e);
      return i ? { done: !0 } : {
        innerValue: o,
        currentState: {
          innerIterator: s.innerIterator,
          outerValue: s.outerValue
        }
      };
    }
  }
}
class y {
  static get(t, e) {
    const { value: r } = y.__findFirst(t, e);
    return r;
  }
  static getOrDefault(t, e, r) {
    const { found: s, value: o } = y.__findFirst(t, r);
    return s ? o : e;
  }
  static getOrThrow(t, e) {
    const { found: r, value: s } = y.__findFirst(t, e);
    if (r)
      return s;
    throw new TypeError("Sequence contains no items");
  }
  static firstIndex(t, e) {
    let r = -1;
    for (const s of t)
      if (r++, e(s))
        return r;
    return -1;
  }
  static __findFirst(t, e) {
    for (const r of t)
      if (!e || e(r))
        return { found: !0, value: r };
    return { found: !1 };
  }
}
class O {
  static get(t, e) {
    let r, s = 0;
    for (const o of t)
      if ((e && e(o) || !e) && (r = o, s++), s > 1)
        throw new TypeError("Sequence contains multiple items");
    if (s === 0)
      throw new TypeError("Sequence contains no items");
    return r;
  }
  static getOrDefault(t, e, r) {
    let s, o = 0;
    for (const i of t)
      if ((r && r(i) || !r) && (s = i, o++), o > 1)
        throw new TypeError("Sequence contains multiple items");
    return o === 0 ? e : s;
  }
}
class K extends I {
  /**
   *
   * @param {Iterable} source
   * @param {number} count
   */
  constructor(t, e) {
    super(t), this.count = e <= 0 ? 0 : e;
  }
  _nativeTake(t) {
    return t.slice(0, this.count);
  }
  [Symbol.iterator]() {
    const { processed: t, source: e } = this._tryNativeProcess();
    if (t)
      return this._getIterator(t);
    const r = this._getIterator(e), s = this.count;
    let o = 0;
    return {
      next() {
        if (o < s) {
          const { done: i, value: u } = r.next();
          return o++, i ? c() : f(u);
        }
        return c();
      }
    };
  }
}
class P extends I {
  /**
   *
   * @param {Iterable} source
   * @param {number} count
   */
  constructor(t, e) {
    super(t), this.count = e <= 0 ? 0 : e;
  }
  _nativeTake(t) {
    return t.slice(this.count, t.length);
  }
  [Symbol.iterator]() {
    const { processed: t, source: e } = this._tryNativeProcess();
    if (t)
      return this._getIterator(t);
    const r = this._getIterator(e), s = this.count;
    let o = 0;
    return {
      next() {
        if (o === 0)
          for (; o < s; ) {
            const { done: i } = r.next();
            if (o++, i)
              return { done: !0 };
          }
        return r.next();
      }
    };
  }
}
class q {
  static get(t, e) {
    for (const r of t)
      if (!e(r))
        return !1;
    return !0;
  }
  static getAllAndEvery(t, e) {
    let r = !1;
    for (const s of t)
      if (r = !0, !e(s))
        return !1;
    return r;
  }
}
class lt {
  static get(t, e) {
    if (e) {
      for (const r of t)
        if (e(r))
          return !0;
      return !1;
    } else
      return !l(t).next().done;
  }
}
class W {
  /**
   *
   * @param {Iterable} source
   * @param {Function} comparer comparer function. if not provider use native Set.
   */
  constructor(t, e) {
    this.source = t, this.comparer = e;
  }
  [Symbol.iterator]() {
    const t = this.source.get();
    if (!this.comparer) {
      const s = new Set(t);
      return l(s);
    }
    const e = l(t), r = new ht(this.comparer);
    return {
      next() {
        for (; ; ) {
          const { done: s, value: o } = e.next();
          if (s)
            return r.clear(), { done: !0 };
          if (!r.has(o))
            return r.add(o), { done: !1, value: o };
        }
      }
    };
  }
  get() {
    return this;
  }
}
class ht {
  constructor(t) {
    this.comparer = t, this.list = [];
  }
  add(t) {
    this.list.push(t);
  }
  has(t) {
    return this.list.some((e) => this.comparer(e, t));
  }
  clear() {
    this.list.length = 0;
  }
}
class B {
  /**
   * The range is [from, to)
   * @param {number} from
   * @param {number} to
   */
  constructor(t, e) {
    this.from = t, this.to = e;
  }
  __ascendingRange() {
    const t = this.to;
    let e = this.from;
    return {
      next() {
        return e < t ? { done: !1, value: e++ } : { done: !0 };
      }
    };
  }
  __descendingRange() {
    const t = this.to;
    let e = this.from;
    return {
      next() {
        return e > t ? { done: !1, value: e-- } : { done: !0 };
      }
    };
  }
  [Symbol.iterator]() {
    return this.from < this.to ? this.__ascendingRange() : this.from > this.to ? this.__descendingRange() : {
      next() {
        return { done: !0 };
      }
    };
  }
  get() {
    return this;
  }
}
class M {
  constructor(t, e) {
    this.value = t, this.times = e;
  }
  [Symbol.iterator]() {
    let t = 0;
    const e = this.times, r = this.value;
    return {
      next() {
        return t < e ? (t++, { done: !1, value: r }) : { done: !0 };
      }
    };
  }
  get() {
    return this;
  }
}
function Q(n) {
  return Array.isArray(n) ? new D(n) : new L(n);
}
function ft(n, t) {
  return new S(n, t);
}
function dt(n) {
  return new F(n);
}
function pt(n, t) {
  return new B(n, t);
}
function _t(n, t) {
  return new M(n, t);
}
function V(n) {
  return typeof n[Symbol.iterator] == "function" ? Q(n) : "length" in n ? dt(n) : ft(n);
}
class J extends h {
  constructor(t, e) {
    super(e), this.key = t;
  }
  get() {
    return this.source;
  }
  [Symbol.iterator]() {
    return this._getIterator(this.source);
  }
}
class _ extends h {
  constructor(t, e, r, s) {
    if (super(t), typeof e > "u")
      throw new Error("keyselector is required");
    this.keySelector = e, this.elementSelector = typeof r > "u" ? E : r, this.resultCreator = typeof s > "u" ? (o, i) => new J(o, i) : s;
  }
  static __group(t, e, r) {
    const s = /* @__PURE__ */ new Map();
    let o = 0;
    for (const i of t) {
      const u = e(i, o);
      if (u !== null && typeof u == "object" || typeof u == "function")
        throw new TypeError("groupBy method does not support keys to be objects or functions");
      const a = r(i, o), d = s.get(u) || [];
      d.push(a), s.set(u, d), o++;
    }
    return s;
  }
  [Symbol.iterator]() {
    const t = this._getSource(), e = _.__group(t, this.keySelector, this.elementSelector), r = this._getIterator(e), s = this.resultCreator;
    return {
      next() {
        const { done: o, value: i } = r.next();
        if (o)
          return e.clear(), { done: !0 };
        const [u, a] = i;
        return {
          done: !1,
          value: s(u, Q(a))
        };
      }
    };
  }
}
class gt {
  static get(t, e) {
    const r = t.get();
    if (Array.isArray(r))
      return e ? r.filter(e).length : r.length;
    let s = 0;
    for (const o of r)
      (e && e(o) || !e) && s++;
    return s;
  }
}
class p {
  static get(t, e) {
    let r, s = -1;
    for (const o of t)
      s === -1 ? (r = o, s = 0) : (s++, r = e(r, o, s));
    if (s === -1)
      throw new TypeError("No items in sequence");
    return r;
  }
  static getWithInitial(t, e, r) {
    let s = r, o = 0;
    for (const i of t)
      o++, s = e(s, i, o);
    return s;
  }
}
class T extends I {
  constructor(t, e, r) {
    super(t), this.keySelector = e, this.comparer = typeof r > "u" ? A : r;
  }
  _nativeTake(t) {
    const e = this._getComparer();
    return [...t].sort(e);
  }
  _getComparer() {
    return (t, e) => this.comparer(this.keySelector(t), this.keySelector(e));
  }
  __sort(t) {
    const e = this._getComparer(), r = Array.from(t);
    return ot(t, 0, r.length - 1, e);
  }
  get() {
    const { processed: t, source: e } = this._tryNativeProcess();
    return t || this.__sort(e);
  }
  [Symbol.iterator]() {
    const t = this.get();
    return this._getIterator(t);
  }
}
class G extends T {
  _getComparer() {
    return (t, e) => 0 - this.comparer(this.keySelector(t), this.keySelector(e));
  }
}
class H extends I {
  /**
   * Creates a Union Iterable
   * @param {Iterable} source input iterable
   * @param {Iterable} second iterable to continue with
   */
  constructor(t, e) {
    super(t), this.second = e;
  }
  _nativeTake(t) {
    if (Array.isArray(this.second))
      return [...t, ...this.second];
  }
  [Symbol.iterator]() {
    const { processed: t, source: e } = this._tryNativeProcess();
    if (t)
      return this._getIterator(t);
    const r = this._getIterator(e), s = this._getIterator(this.second);
    let o = !1;
    return {
      next() {
        if (!o) {
          const i = r.next();
          if (i.done)
            o = !0;
          else
            return { done: !1, value: i.value };
        }
        if (o) {
          const i = s.next();
          return i.done ? { done: !0 } : { done: !1, value: i.value };
        }
      }
    };
  }
}
class yt {
  static get(t, e) {
    for (const r of t)
      e(r);
  }
}
class xt {
  static get(t, e) {
    let r = 0;
    for (const s of t) {
      if (r === e)
        return s;
      r++;
    }
  }
}
class v extends h {
  constructor(t, e) {
    super(t), this.second = e;
  }
  static __getNext(t, e, r, s, o) {
    for (; !e || !s; ) {
      if (!e) {
        const i = t.next();
        if (!i.done && o.tryAdd(i.value))
          return i;
        i.done && (e = !0);
      }
      if (e && !s) {
        const i = r.next();
        if (!i.done && o.tryAdd(i.value))
          return i;
        i.done && (s = !0);
      }
    }
    if (e && s)
      return o.clear(), { done: !0 };
  }
  [Symbol.iterator]() {
    const t = this._getIterator(this.source), e = this._getIterator(this.second), r = new it();
    let s = !1, o = !1;
    return {
      next() {
        return v.__getNext(t, s, e, o, r);
      }
    };
  }
}
class b extends h {
  /**
   * Creates group join iterable
   * @param {Iterable} source
   * @param {Iterable} joinIterable
   * @param {Function} sourceKeySelector
   * @param {Function} joinIterableKeySelector
   * @param {Function} resultCreator
   */
  constructor(t, e, r, s, o) {
    super(t), this.joinIterable = e, this.sourceKeySelector = r, this.joinIterableKeySelector = s, this.resultCreator = o;
  }
  static __getNext(t, e, r, s) {
    const { done: o, value: i } = t.next();
    if (o)
      return r.clear(), { done: !0 };
    const u = e(i), a = r.get(u) || [];
    return {
      done: !1,
      value: s(i, a)
    };
  }
  [Symbol.iterator]() {
    const t = this._getSourceIterator(), e = _.__group(this.joinIterable, this.joinIterableKeySelector, E), r = this.sourceKeySelector, s = this.resultCreator;
    return {
      next() {
        return b.__getNext(t, r, e, s);
      }
    };
  }
}
class U extends h {
  /**
   * Creates join iterable
   * @param {Iterable} source
   * @param {Iterable} joinIterable
   * @param {Function} sourceKeySelector
   * @param {Function} joinIterableKeySelector
   * @param {Function} resultCreator
   */
  constructor(t, e, r, s, o) {
    super(t), this.joinIterable = e, this.sourceKeySelector = r, this.joinIterableKeySelector = s, this.resultCreator = o;
  }
  [Symbol.iterator]() {
    const t = this.resultCreator, e = this._getSourceIterator(), r = _.__group(this.joinIterable, this.joinIterableKeySelector, E), s = (i) => {
      const u = this.sourceKeySelector(i);
      return r.get(u) || [];
    };
    let o = null;
    return {
      next() {
        const i = g.__getNextItem(e, s, o);
        return i.done ? c() : (o = i.currentState, f(t(o.outerValue, i.innerValue)));
      }
    };
  }
}
class j {
  static get(t, e, r) {
    const s = typeof r > "u" ? C : r, o = l(t), i = l(e);
    let u = !1;
    for (; !u; ) {
      const a = o.next(), d = i.next();
      if (a.done !== d.done || !a.done && !d.done && !s(a.value, d.value))
        return !1;
      u = a.done;
    }
    return !0;
  }
  static getDifferentPosition(t, e, r) {
    const s = typeof r > "u" ? C : r, o = l(t), i = Array.isArray(e) ? [...e] : Array.from(e);
    let u = !1;
    for (; !u; ) {
      const a = o.next();
      if (u = a.done, !a.done && i.length === 0 || a.done && i.length > 0)
        return !1;
      if (a.done && i.length === 0)
        return !0;
      const d = i.length;
      for (let w = 0; w < i.length; w++) {
        const nt = i[w];
        if (s(a.value, nt)) {
          i.splice(w, 1);
          break;
        }
      }
      if (d === i.length)
        return !1;
    }
    return i.length === 0;
  }
}
class X extends h {
  constructor(t, e) {
    super(t), this.pageSize = e;
  }
  [Symbol.iterator]() {
    const t = this.pageSize, e = this._getSourceIterator();
    let r = !1;
    return {
      next() {
        if (r)
          return c();
        let s = 0, o = [];
        for (; s < t; ) {
          const i = e.next();
          if (i.done)
            return o.length === 0 ? c() : (r = !0, f(o));
          o.push(i.value), s++;
        }
        return { done: !1, value: o };
      }
    };
  }
}
class Y extends h {
  constructor(t) {
    super(t);
  }
  [Symbol.iterator]() {
    const t = this.source.toArray();
    let e = t.length - 1;
    return {
      next() {
        if (e < 0)
          return c();
        const r = t[e];
        return e--, f(r);
      }
    };
  }
}
class Z extends h {
  /**
   *
   * @param {Iterable} source
   * @param {number} condition
   */
  constructor(t, e) {
    super(t), this.condition = e;
  }
  [Symbol.iterator]() {
    const t = this._getSourceIterator(), e = this.condition;
    let r = -1;
    return {
      next() {
        const { done: s, value: o } = t.next();
        return r++, !s && e(o, r) ? f(o) : c();
      }
    };
  }
}
class $ extends h {
  /**
   *
   * @param {Iterable} source
   * @param {number} condition
   */
  constructor(t, e) {
    super(t), this.condition = e;
  }
  [Symbol.iterator]() {
    const t = this._getSourceIterator(), e = this.condition;
    let r = !1, s = -1;
    return {
      next() {
        const { done: o, value: i } = t.next();
        if (s++, o)
          return c();
        if (r)
          return f(i);
        {
          let u = { done: !1, value: i };
          for (; !u.done && e(u.value, s); )
            u = t.next(), s++;
          return u.done ? c() : (r = !0, f(u.value));
        }
      }
    };
  }
}
class tt extends h {
  /**
   *
   * @param {Iterable} source
   * @param {number} count
   */
  constructor(t, e) {
    super(t), this.count = e <= 0 ? 0 : e;
  }
  /**
   * Create a class which works as FIFO, but has a limit if limit is reached
   * elements are removed
   */
  __createLimitedQueue() {
    class t {
      constructor(r) {
        this.container = [], this.limit = r;
      }
      push(r) {
        this.container.push(r), this.container.length > this.limit && this.container.shift();
      }
      next() {
        return this.container.length === 0 ? c() : f(this.container.shift());
      }
    }
    return new t(this.count);
  }
  [Symbol.iterator]() {
    if (!this.count)
      return ut();
    const t = this._getSourceIterator(), e = this.__createLimitedQueue();
    let r = !1;
    return {
      next() {
        if (!r) {
          let s = t.next();
          for (; !s.done; )
            e.push(s.value), s = t.next();
          r = !0;
        }
        return e.next();
      }
    };
  }
}
class et extends h {
  /**
   *
   * @param {Iterable} source
   * @param {number} condition
   */
  constructor(t, e) {
    super(t), this.count = e <= 0 ? 0 : e;
  }
  [Symbol.iterator]() {
    const t = this._getSourceIterator(), e = this.count, r = [];
    let s = { done: !1 };
    return {
      next() {
        for (; !s.done && r.length <= e; )
          s = t.next(), s.done || r.push(s.value);
        return s.done ? c() : f(r.shift());
      }
    };
  }
}
class x {
  static get(t, e) {
    const { value: r } = x.__findLast(t, e);
    return r;
  }
  static getOrDefault(t, e, r) {
    const { found: s, value: o } = x.__findLast(t, r);
    return s ? o : e;
  }
  static getOrThrow(t, e) {
    const { found: r, value: s } = x.__findLast(t, e);
    if (r)
      return s;
    throw new TypeError("Sequence contains no items");
  }
  static lastIndex(t, e) {
    let r = -1, s = r;
    for (const o of t)
      r++, e(o) && (s = r);
    return s;
  }
  static __findLast(t, e) {
    let r = !1, s;
    for (const o of t)
      (!e || e(o)) && (s = o, r = !0);
    return { found: r, value: s };
  }
}
class rt extends h {
  constructor(t, e, r) {
    super(t), this.other = e, this.comparer = r || C;
  }
  __createContainingChecker() {
    class t {
      constructor(r, s) {
        this.other = V(r).distinct(s).toArray(), this.comparer = s;
      }
      has(r) {
        const s = V(this.other).firstIndex((o) => this.comparer(r, o));
        return s > -1 ? (this.other.splice(s, 1), !0) : !1;
      }
    }
    return new t(this.other, this.comparer);
  }
  [Symbol.iterator]() {
    const t = this.__createContainingChecker(this.other, this.comparer), e = this._getSourceIterator();
    return {
      next() {
        return m.__findNext(e, (r) => t.has(r));
      }
    };
  }
}
const mt = {
  where(n) {
    return ct.create(this, n);
  },
  select(n) {
    return new z(this, n);
  },
  selectMany(n, t) {
    return new g(this, n, t);
  },
  take(n) {
    return new K(this, n);
  },
  takeWhile(n) {
    return new Z(this, n);
  },
  takeLast(n) {
    return new tt(this, n);
  },
  skip(n) {
    return new P(this, n);
  },
  skipWhile(n) {
    return new $(this, n);
  },
  skipLast(n) {
    return new et(this, n);
  },
  distinct(n) {
    return new W(this, n);
  },
  ofType(n) {
    return typeof n == "string" ? new m(this, function(t) {
      return typeof t === n;
    }) : new m(this, n);
  },
  ofClass(n) {
    return new m(this, function(t) {
      return t instanceof n;
    });
  },
  groupBy(n, t, e) {
    return new _(this, n, t, e);
  },
  orderBy(n, t) {
    return new T(this, n, t);
  },
  orderByDescending(n, t) {
    return new G(this, n, t);
  },
  groupJoin(n, t, e, r) {
    return new b(this, n, t, e, r);
  },
  join(n, t, e, r) {
    return arguments.length === 1 ? this.select((s) => "" + s).toArray().join(
      /*separator*/
      n
    ) : new U(this, n, t, e, r);
  },
  concat(n) {
    return new H(this, n);
  },
  union(n) {
    return new v(this, n);
  },
  intersect(n, t) {
    return new rt(this, n, t);
  },
  page(n) {
    return new X(this, n);
  },
  reverse() {
    return new Y(this);
  },
  toArray(n) {
    return at.get(this, n);
  },
  toMap(n, t) {
    const e = typeof t > "u";
    return new Map(
      this.select((r) => [
        n(r),
        e ? r : t(r)
      ])
    );
  },
  toSet() {
    return new Set(this.get());
  },
  first(n) {
    return y.get(this, n);
  },
  firstOrDefault(n, t) {
    return y.getOrDefault(this, n, t);
  },
  firstOrThrow(n) {
    return y.getOrThrow(this, n);
  },
  firstIndex(n) {
    return y.firstIndex(this, n);
  },
  last(n) {
    return x.get(this, n);
  },
  lastOrDefault(n, t) {
    return x.getOrDefault(this, n, t);
  },
  lastOrThrow(n) {
    return x.getOrThrow(this, n);
  },
  lastIndex(n) {
    return x.lastIndex(this, n);
  },
  single(n) {
    return O.get(this, n);
  },
  singleOrDefault(n, t) {
    return O.getOrDefault(this, n, t);
  },
  all(n) {
    return q.get(this, n);
  },
  allAndEvery(n) {
    return q.getAllAndEvery(this, n);
  },
  any(n) {
    return lt.get(this, n);
  },
  count(n) {
    return gt.get(this, n);
  },
  aggregate(n, t) {
    switch (arguments.length) {
      case 1:
        return p.get(this, n);
      case 2:
        return p.getWithInitial(this, n, t);
      default:
        throw new RangeError("invalid arguments");
    }
  },
  sum() {
    return p.get(this, (n, t) => n + t);
  },
  product() {
    return p.get(this, (n, t) => n * t);
  },
  min(n) {
    const t = typeof n > "u" ? A : n;
    return p.get(this, (e, r) => {
      const s = t(e, r);
      return s < 0 ? e : s > 0 ? r : e;
    });
  },
  max(n) {
    const t = typeof n > "u" ? A : n;
    return p.get(this, (e, r) => {
      const s = t(e, r);
      return s < 0 ? r : s > 0 ? e : r;
    });
  },
  elementAt(n) {
    return xt.get(this, n);
  },
  forEach(n) {
    return yt.get(this, n);
  },
  isEqual(n, t) {
    return j.get(this, n, t);
  },
  isElementsEqual(n, t) {
    return j.getDifferentPosition(this, n, t);
  }
};
st(mt, [
  L,
  D,
  F,
  S,
  m,
  N,
  z,
  g,
  K,
  P,
  B,
  M,
  W,
  J,
  _,
  T,
  G,
  H,
  v,
  b,
  U,
  X,
  Y,
  Z,
  $,
  tt,
  et,
  rt
]);
export {
  V as from,
  dt as fromArrayLike,
  Q as fromIterable,
  ft as fromObject,
  pt as range,
  _t as repeat
};
