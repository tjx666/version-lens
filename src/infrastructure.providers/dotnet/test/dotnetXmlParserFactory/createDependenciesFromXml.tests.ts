import { createDependenciesFromXml } from 'infrastructure.providers.dotnet';

import Fixtures from './createDependenciesFromXml.fixtures';

const assert = require('assert');

export default {

  "returns empty when no matches found": () => {
    const includeNames = []
    const results = createDependenciesFromXml('', includeNames);
    assert.equal(results.length, 0);
  },

  "returns empty when no dependency entry names match": () => {
    const includeNames = ["non-dependencies"]
    const results = createDependenciesFromXml(
      Fixtures.createDependenciesFromXml.test,
      includeNames
    );
    assert.equal(results.length, 0);
  },

  "extracts dependency entries from dotnet xml": () => {
    const includeNames = ["PackageReference", "PackageVersion"]
    const results = createDependenciesFromXml(
      Fixtures.createDependenciesFromXml.test,
      includeNames
    );
    assert.deepEqual(results, Fixtures.createDependenciesFromXml.expected);
  }

}