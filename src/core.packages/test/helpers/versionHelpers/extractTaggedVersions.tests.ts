import { VersionHelpers } from 'core.packages';

const assert = require('assert');

const testVersions = [
  "2.0.0-preview.1",
  "2.0.0",
  "2.1.0-preview.2",
  "2.1.0",
  "2.2.0-preview.3",
  "2.2.0-preview.4",
  "2.2.0-preview.5",
  "2.2.0",
  "2.2.1",
];

export default {

  "returns empty when no matches found": () => {
    const results = VersionHelpers.extractTaggedVersions([]);
    assert.equal(results.length, 0);
  },

  "extracts prerelease tags": () => {

    const expected = [
      '2.0.0-preview.1',
      '2.1.0-preview.2',
      '2.2.0-preview.3',
      '2.2.0-preview.4',
      '2.2.0-preview.5',
    ]

    const results = VersionHelpers.extractTaggedVersions(testVersions);
    assert.equal(results.length, expected.length);
    expected.forEach((expectedValue, index) => {
      assert.equal(results[index].name, expectedValue.substr(6, 7));
      assert.equal(results[index].version, expectedValue);
    })
  }

}