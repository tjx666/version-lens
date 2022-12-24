import { parseVersionSpec } from 'infrastructure.providers.dotnet';

const assert = require('assert');

export default {

  'converts basic nuget ranges to node ranges': () => {
    const expectedList = [
      // basic
      "1.0.0", "1.0.0",
      "(1.0.0,)", ">1.0.0",
      "[1.0.0]", "1.0.0",
      "(,1.0.0]", "<=1.0.0",
      "[1.0.0,2.0.0]", ">=1.0.0 <=2.0.0",
      "(1.0.0,2.0.0)", ">1.0.0 <2.0.0",
      "[1.0.0,2.0.0)", ">=1.0.0 <2.0.0"
    ];

    for (let i = 0; i < expectedList.length; i += 2) {
      const test = expectedList[i];
      const expected = expectedList[i + 1];
      const specTest = parseVersionSpec(test);
      assert.equal(specTest.resolvedVersion, expected, "nuget range did not convert to node range at " + i);
    }
  },

  'converts partial nuget ranges to node ranges': () => {
    const expectedList = [
      "1", "1.0.0",
      "1.0", "1.0.0",
      "[1,2]", ">=1.0.0 <=2.0.0",
      "(1,2)", ">1.0.0 <2.0.0",
    ];

    for (let i = 0; i < expectedList.length; i += 2) {
      const test = expectedList[i];
      const expected = expectedList[i + 1];
      const specTest = parseVersionSpec(test);
      assert.equal(specTest.resolvedVersion, expected, `nuget range did not convert ${expected} to ${specTest.resolvedVersion} at ${i}`);
    }
  },

  'returns null for invalid ranges': () => {
    const results = [
      parseVersionSpec("1.").spec,
      parseVersionSpec("1.0.").spec,
      parseVersionSpec("s.2.0").spec,
      parseVersionSpec("beta").spec,
    ];

    results.forEach(x => {
      assert.ok(!x, "Should not parse range")
    })
  },

  'handles floating ranges': () => {
    const expectedList = [
      "1.*", ">=1.0.0 <2.0.0-0",
      "1.0.*", ">=1.0.0 <1.1.0-0"
    ];

    for (let i = 0; i < expectedList.length; i += 2) {
      const test = expectedList[i];
      const expected = expectedList[i + 1];
      const specTest = parseVersionSpec(test);
      assert.equal(specTest.resolvedVersion, expected, `nuget floating range did not convert ${expected} to ${specTest.resolvedVersion} at ${i}`);
    }
  },

  'No nulls from valid notations': () => {
    // spec https://docs.microsoft.com/en-us/nuget/create-packages/dependency-versions#version-ranges
    const results = [
      parseVersionSpec("1.0.0").spec,
      parseVersionSpec("(1.0.0,)").spec,
      parseVersionSpec("[1.0.0]").spec,
      parseVersionSpec("(,1.0.0]").spec,
      parseVersionSpec("(,1.0.0)").spec,
      parseVersionSpec("[1.0.0,2.0.0]").spec,
      parseVersionSpec("(1.0.0,2.0.0)").spec,
      parseVersionSpec("[1.0.0,2.0.0)").spec,
      parseVersionSpec("(1.0.0)").spec   // should be null though
    ];

    results.forEach(x => {
      assert.ok(!!x, "Could not parse range")
    })
  },

  'returns nulls from invalid notations': () => {
    const results = [
      parseVersionSpec("1.").spec,
      parseVersionSpec("1.0.").spec,
      parseVersionSpec("s.2.0").spec,
      parseVersionSpec("beta").spec
    ];

    results.forEach(x => {
      assert.ok(!x, "Could not parse range")
    })
  },

  'returns true for four segment versions': () => {
    const results = [
      parseVersionSpec("1.0.0.1").spec,
    ];

    results.forEach(x => {
      assert.ok(x.hasFourSegments)
    })
  }


}