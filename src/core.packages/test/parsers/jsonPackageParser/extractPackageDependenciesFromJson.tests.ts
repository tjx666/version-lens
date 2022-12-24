import { extractPackageDependenciesFromJson } from 'core.packages';

import Fixtures from './extractPackageDependenciesFromJson.fixtures';

const assert = require('assert');

export default {

  "returns empty when no matches found": () => {
    const includeNames = []
    const results = extractPackageDependenciesFromJson('', includeNames);
    assert.equal(results.length, 0);
  },

  "returns empty when no dependency entry names match": () => {
    const includeNames = ["non-dependencies"]
    const results = extractPackageDependenciesFromJson(
      JSON.stringify(Fixtures.extractDependencyEntries.test),
      includeNames
    );
    assert.equal(results.length, 0);
  },

  "extracts dependency entries from json": () => {
    const includeNames = ["dependencies"]
    const results = extractPackageDependenciesFromJson(
      JSON.stringify(Fixtures.extractDependencyEntries.test),
      includeNames
    );
    assert.deepEqual(results, Fixtures.extractDependencyEntries.expected);
  }

}