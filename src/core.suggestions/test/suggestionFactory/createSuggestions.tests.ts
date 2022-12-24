import {
  SuggestionFactory,
  SuggestionStatus,
  SuggestionFlags
} from 'core.suggestions';

const assert = require('assert');

export default {

  "returns PackageVersionStatus.nomatch": {

    "when releases and prereleases are empty": () => {
      const expected = [
        {
          name: SuggestionStatus.NoMatch,
          version: '',
          flags: SuggestionFlags.status
        }
      ]

      const testRange = '*'
      const testReleases = []
      const testPrereleases = []
      const results = SuggestionFactory.createSuggestions(
        testRange,
        testReleases,
        testPrereleases
      );
      assert.equal(results.length, expected.length);
      assert.equal(results[0].name, expected[0].name);
      assert.equal(results[0].version, expected[0].version);
      assert.equal(results[0].flags, expected[0].flags);
    },

    "when releases or prereleases do not contain a matching version": () => {

      const expected = [
        {
          name: SuggestionStatus.NoMatch,
          version: '',
          flags: SuggestionFlags.status
        },
        {
          name: SuggestionStatus.Latest,
          version: '1.0.0',
          flags: SuggestionFlags.release
        }
      ]

      const testRange = '2.0.0'
      const testReleases = ['1.0.0']
      const testPrereleases = ['1.1.0-alpha.1']
      const results = SuggestionFactory.createSuggestions(
        testRange,
        testReleases,
        testPrereleases
      );
      assert.deepEqual(results, expected);
    },

    "when using a release range": () => {
      const expected = [
        {
          name: SuggestionStatus.NoMatch,
          version: '',
          flags: SuggestionFlags.status
        },
        {
          name: SuggestionStatus.Latest,
          version: '1.0.3-1.2.3',
          flags: SuggestionFlags.release
        }
      ]

      const testRange = '^1.0.0'
      const testReleases = ['0.0.6']
      const testPrereleases = ['1.0.1-1.2.3', '1.0.2-1.2.3', '1.0.3-1.2.3']
      const results = SuggestionFactory.createSuggestions(
        testRange,
        testReleases,
        testPrereleases,
        '1.0.3-1.2.3'
      );
      assert.equal(results.length, expected.length);
    },

  },

  "returns PackageVersionStatus.Latest": {

    "when versionRange matches the latest release": () => {

      const expected = [
        {
          name: SuggestionStatus.Latest,
          version: '',
          flags: SuggestionFlags.status
        },
        {
          name: 'next',
          version: '4.0.0-next',
          flags: SuggestionFlags.prerelease
        }
      ]

      const testReleases = ['1.0.0', '2.0.0', '2.1.0', '3.0.0']
      const testPrereleases = ['1.1.0-alpha.1', '4.0.0-next']
      const testRanges = [
        '3.0.0',
        '^3.0.0'
      ]

      testRanges.forEach(testRange => {
        const results = SuggestionFactory.createSuggestions(
          testRange,
          testReleases,
          testPrereleases
        );
        assert.deepEqual(results, expected);
      })

    },

    "when suggestedVersion is the latest release": () => {
      const testSuggestedVersion = '5.0.0';

      const expected = [
        {
          name: SuggestionStatus.Latest,
          version: '',
          flags: SuggestionFlags.status
        }
      ]

      const testReleases = ['0.0.5', '2.0.0', '5.0.0']
      const testPrereleases = ['1.1.0-alpha.1', '4.0.0-next']
      const testRange = testSuggestedVersion

      const results = SuggestionFactory.createSuggestions(
        testRange,
        testReleases,
        testPrereleases,
        testSuggestedVersion
      );
      assert.deepEqual(results, expected);
    },

  },

  "returns PackageVersionStatus.LatestIsPrerelease": {

    "when suggestedVersion is not the latest release": () => {
      const testDistTagLatest = '4.0.0-next';

      const expected = [
        {
          name: SuggestionStatus.NoMatch,
          version: '',
          flags: SuggestionFlags.status
        },
        {
          name: SuggestionStatus.LatestIsPrerelease,
          version: '4.0.0-next',
          flags: SuggestionFlags.prerelease
        }
      ]

      const testReleases = ['0.0.5', '0.0.6']
      const testPrereleases = ['1.1.0-alpha.1', '4.0.0-next']
      const testRange = '4.0.0'

      const results = SuggestionFactory.createSuggestions(
        testRange,
        testReleases,
        testPrereleases,
        testDistTagLatest
      );
      assert.deepEqual(results, expected);
    },

  },

  "returns PackageVersionStatus.satisfies": {

    "when versionRange satisfies the latest release": () => {

      const expected = [
        {
          name: SuggestionStatus.Satisfies,
          version: 'latest',
          flags: SuggestionFlags.status
        },
        {
          name: SuggestionStatus.Latest,
          version: '3.0.0',
          flags: SuggestionFlags.release
        },
        {
          name: 'next',
          version: '4.0.0-next',
          flags: SuggestionFlags.prerelease
        }
      ]

      const testReleases = ['1.0.0', '2.0.0', '2.1.0', '3.0.0']
      const testPrereleases = ['1.1.0-alpha.1', '4.0.0-next']

      const results = SuggestionFactory.createSuggestions(
        '>=2',
        testReleases,
        testPrereleases
      );

      assert.deepEqual(results, expected);
    },

    "when versionRange satisfies the latest tagged release": () => {
      const testLatest = '7.10.1'

      const expected = [
        {
          name: SuggestionStatus.Satisfies,
          version: 'latest',
          flags: SuggestionFlags.status
        },
        {
          name: SuggestionStatus.Latest,
          version: testLatest,
          flags: SuggestionFlags.release
        },
        {
          name: 'next',
          version: '8.0.0-next',
          flags: SuggestionFlags.prerelease
        }
      ]

      const testReleases = ['1.0.0', '2.0.0', '2.1.0', '7.9.6', '7.9.7', testLatest]
      const testPrereleases = ['1.1.0-alpha.1', '8.0.0-next']

      const results = SuggestionFactory.createSuggestions(
        '^7.9.1',
        testReleases,
        testPrereleases,
        testLatest
      );

      assert.deepEqual(results, expected);
    },
    "when versionRange satisfies a range in the releases": () => {

      const expected = [
        {
          name: SuggestionStatus.Satisfies,
          version: '2.1.0',
          flags: SuggestionFlags.release
        },
        {
          name: SuggestionStatus.Latest,
          version: '3.0.0',
          flags: SuggestionFlags.release
        },
        {
          name: 'next',
          version: '4.0.0-next',
          flags: SuggestionFlags.prerelease
        }
      ]

      const testReleases = ['1.0.0', '2.0.0', '2.1.0', '3.0.0']
      const testPrereleases = ['1.1.0-alpha.1', '4.0.0-next']
      const testRanges = [
        '2.*'
      ]

      testRanges.forEach(testRange => {
        const results = SuggestionFactory.createSuggestions(
          testRange,
          testReleases,
          testPrereleases
        );
        assert.deepEqual(results, expected);
      })

    },

  },

}