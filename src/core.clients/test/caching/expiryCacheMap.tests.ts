import { delay } from 'infrastructure.testing';

import { ExpiryCacheMap, ICachingOptions } from 'core.clients';

const assert = require('assert');

let testCacheMap

export const ExpiryCacheMapTests = {

  beforeEach: () => {
    // setup the client cache
    testCacheMap = new ExpiryCacheMap(<ICachingOptions>{ duration: 30000 })
  },

  "hasExpired(key)": {

    "returns true when no key exists": () => {
      const testKey = 'missing';
      assert.ok(testCacheMap.hasExpired(testKey), 'ExpiryCacheMap.hasExpired(key): A missing key should be expired');
    },

    "returns false when the a cache entry is still within the cache duration": () => {
      const testKey = 'key1';
      testCacheMap.set(testKey, {});
      const actual = testCacheMap.hasExpired(testKey);
      assert.ok(actual === false, 'ExpiryCacheMap.hasExpired(key): A cache entry within the cache duration should NOT be expired');
    },

    "returns true when the cache entry is beyond the cache duration": () => {
      const testKey = 'key1';

      testCacheMap = new ExpiryCacheMap(<ICachingOptions>{ duration: -1 });
      testCacheMap.set(testKey, {});
      const actual = testCacheMap.hasExpired(testKey);
      assert.ok(actual, 'ExpiryCacheMap.hasExpired(key): A cache entry beyond the cache duration should be expired');
    },

    "returns true when duration has elapsed": async () => {
      const testKey = 'duration';
      const testDuration = 250;

      testCacheMap = new ExpiryCacheMap(<ICachingOptions>{ duration: testDuration });
      testCacheMap.set(testKey, "should of expired")

      return delay(testDuration + 10)
        .then(finished => {
          const actual = testCacheMap.hasExpired(testKey);
          assert.equal(actual, true);
        });
    },

    "returns false when duration has not elapsed": async () => {
      const testKey = 'duration';
      const testDuration = 250;

      testCacheMap = new ExpiryCacheMap(<ICachingOptions>{ duration: testDuration });
      testCacheMap.set(testKey, "should not be expired")

      return delay(testDuration - 100)
        .then(finished => {
          const actual = testCacheMap.hasExpired(testKey);
          assert.equal(actual, false);
        });
    },

  },

  "get(key)": {

    "returns undefined if the key does not exist": () => {
      const testKey = 'missing';
      const actual = testCacheMap.get(testKey);
      assert.equal(actual, undefined, 'ExpiryCacheMap.get(key): Should return undefined when the key doesnt exist');
    },

    "returns the data by the key": () => {
      const testKey = 'key1';
      const testData = {};

      testCacheMap = new ExpiryCacheMap(<ICachingOptions>{ duration: -1 });
      testCacheMap.set(testKey, testData);
      const actual = testCacheMap.get(testKey);
      assert.equal(actual, testData, 'ExpiryCacheMap.set(key, data): Should store the data by the key');
    }

  },

  "set(key, data)": {

    "stores the data by the key": () => {
      const testKey = 'key1';
      const testData = {};
      testCacheMap.set(testKey, testData);
      const actual = testCacheMap.get(testKey);
      assert.equal(actual, testData, 'ExpiryCacheMap.set(key, data): Should store the data by the key');
    },

    "returns the data that was set": () => {
      const testKey = 'key1';
      const testData = {};
      const actual = testCacheMap.set(testKey, testData);
      assert.equal(actual, testData, 'ExpiryCacheMap.set(key, data): Should return the data');
    }

  },

  "expire(key)": {

    "expires items in the cache": () => {
      const testKey = 'key1';
      const testData = "initial data";

      testCacheMap.set(testKey, testData);
      testCacheMap.expire(testKey);
      assert.ok(testCacheMap.hasExpired(testKey), true, 'ExpiryCacheMap.expire(key): Should expiry the item');

      testCacheMap.set(testKey, "new data");
      assert.ok(testCacheMap.get(testKey), "new data", 'ExpiryCacheMap.get(key): Should contain new data');
    }

  }

}