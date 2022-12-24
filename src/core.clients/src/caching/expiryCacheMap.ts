import { ICachingOptions } from "../definitions/iCachingOptions";

export type CacheEntry<T> = {
  expiryTime: number,
  data: T
};

type CacheMap<T> = {
  [key: string]: CacheEntry<T>;
};

export class ExpiryCacheMap<T> {

  cachingOpts: ICachingOptions;

  cacheMap: CacheMap<T>;

  constructor(cachingOpts: ICachingOptions) {
    this.cachingOpts = cachingOpts;
    this.cacheMap = {};
  }

  clear() {
    this.cacheMap = {};
  }

  hasExpired(key: string): boolean {
    const entry = this.cacheMap[key];
    if (!entry) return true;

    return Date.now() > entry.expiryTime;
  }

  expire(key: string): T {
    const entry = this.cacheMap[key];
    if (entry) delete this.cacheMap[key];
    return entry.data;
  }

  get(key: string): T {
    const entry = this.cacheMap[key];
    return entry && entry.data;
  }

  set(key: string, data: T): T {
    const expiryTime = Date.now() + this.cachingOpts.duration;
    const newEntry = {
      expiryTime,
      data
    };
    this.cacheMap[key] = newEntry;
    return newEntry.data;
  }

}