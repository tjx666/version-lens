import { VersionHelpers } from 'core.packages';

const assert = require('assert');

const testPrereleases = [
  '2.0.0-preview1.12141.1',
  '2.0.0-preview2.45112.2',
  '2.0.0-preview3.13311.9',
  '2.0.0-preview4.17421.6',
  '2.1.0-preview1-final',
  '2.1.0-legacy.1',
  '2.1.0-legacy.2',
  '2.1.0-legacy.3',
  '2.5.0-tag.1',
  '2.5.0-tag.2',
  '2.5.0-tag.3',
  '2.1.0-beta1',
  '2.1.0-beta2',
  '2.1.0-beta3',
];

export default {

  "returns empty when no matches found": () => {
    const results = VersionHelpers.filterPrereleasesGtMinRange('*', []);
    assert.equal(Object.keys(results).length, 0);
  },

  "handles non semver versions without error": () => {
    const tests = [
      '2.1.0.RELEASE',
      '2.1.0.3',
    ]

    tests.forEach(testVersion => {
      const results = VersionHelpers.filterPrereleasesGtMinRange(testVersion, testPrereleases);
      assert.deepEqual(results.length, 0, testVersion);
    });
  },

  "groups prereleases by name": () => {
    const expected = [
      '2.1.0-preview1-final',
      '2.1.0-legacy.3',
      '2.5.0-tag.3',
      '2.1.0-beta3',
    ]
    const results = VersionHelpers.filterPrereleasesGtMinRange('2.*', testPrereleases);
    assert.equal(results.length, expected.length);
    expected.forEach((expectedValue, index) => {
      assert.equal(results[index], expectedValue);
    })
  },

  "returns empty when prereleases are <= specified versions": () => {

    const tests = [
      // greater
      '3.*',
      '~2.6.1',
      '2.5.9',

      // equals
      '2.5.0-tag.3',
    ]

    tests.forEach(testVersion => {
      const results = VersionHelpers.filterPrereleasesGtMinRange(testVersion, testPrereleases);
      assert.deepEqual(results.length, 0, testVersion);
    });
  },

  "returns prereleases > specified versions": () => {
    const expected = [
      '2.1.0-preview1-final',
      '2.1.0-legacy.3',
      '2.5.0-tag.3',
      '2.1.0-beta3',
    ]

    const tests = [
      // less than
      '2.*',
      '~2.0.1',
      '2.0.9'
    ]

    tests.forEach(testVersion => {
      const results = VersionHelpers.filterPrereleasesGtMinRange(testVersion, testPrereleases);
      assert.deepEqual(results, expected);
    });
  },


}
