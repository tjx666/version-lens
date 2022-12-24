import { VersionHelpers } from 'core.packages';

const assert = require('assert');

export default {

  "returns false when not fixed": () => {
    const testVersions = [
      '~1.2.3',
      '^4.5.6-beta',
      '1.2.*',
      '>=1.2',
      '*',
    ]

    testVersions.forEach(testVersion => {
      const actual = VersionHelpers.isFixedVersion(testVersion)
      assert.equal(actual, false);
    })
  },

  "returns true for fixed versions": () => {
    const testVersions = [
      '1.2.3',
      '4.5.6-beta',
    ]
    testVersions.forEach(testVersion => {
      const actual = VersionHelpers.isFixedVersion(testVersion)
      assert.equal(actual, true);
    })
  },

}