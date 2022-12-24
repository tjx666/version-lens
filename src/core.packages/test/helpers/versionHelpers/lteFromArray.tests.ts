import { VersionHelpers } from 'core.packages';

const assert = require('assert');

export default {

  "returns empty when versions is empty": () => {
    const results = VersionHelpers.lteFromArray([], '1.2.3');
    assert.equal(results.length, 0);
  },

  "returns lte versions for version inputs": () => {

    const testVersion = '0.8.19'

    const testReleases = [
      '0.0.1',
      '0.4.23',
      '0.6.23',
      '0.8.19',
      '1.0.0',
      '4.0.0',
    ]

    const expected = [
      '0.0.1',
      '0.4.23',
      '0.6.23',
      '0.8.19',
    ]

    const results = VersionHelpers.lteFromArray(testReleases, testVersion);
    assert.deepEqual(results, expected);
  },

}