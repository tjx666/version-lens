import { VersionHelpers } from 'core.packages';

const assert = require('assert');

const testVersions = [
  '1.0.0',
  '2.0.0',
  '2.0.0-beta.1',
  '2.0.0.1',
  '9.5.12',
  '11.1.9',
  '11.1.9.1',
  '12.0.0-next.1',
]

export default {

  "returns versions when no matches found": () => {
    const expected = [
      '1.0.0',
      '2.0.0',
    ]
    const results = VersionHelpers.removeFourSegmentVersionsFromArray(expected);
    assert.equal(results.length, expected.length);
    expected.forEach((expectedVersion, index) => {
      assert.equal(results[index], expectedVersion);
    })
  },

  "returns versions without four segment versions": () => {
    const expected = [
      '1.0.0',
      '2.0.0',
      '2.0.0-beta.1',
      '9.5.12',
      '11.1.9',
      '12.0.0-next.1',
    ]
    const results = VersionHelpers.removeFourSegmentVersionsFromArray(testVersions);
    assert.equal(results.length, expected.length);
    expected.forEach((expectedVersion, index) => {
      assert.equal(results[index], expectedVersion);
    })
  }

}