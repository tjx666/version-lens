import {
  SuggestionFactory,
  SuggestionStatus,
  SuggestionFlags
} from 'core.suggestions';

const assert = require('assert');

export default {

  "createLatest": {

    "when version param is undefined then returns 'latest' tagged package suggestion": () => {
      const actual = SuggestionFactory.createLatest()
      assert.deepEqual(
        actual,
        {
          name: SuggestionStatus.Latest,
          version: SuggestionStatus.Latest,
          flags: SuggestionFlags.tag
        });
    },

    "when version param is a release then returns 'latest' version package suggestion": () => {
      const testRelease = '1.0.0';
      const actual = SuggestionFactory.createLatest(testRelease)
      assert.deepEqual(
        actual,
        {
          name: SuggestionStatus.Latest,
          version: testRelease,
          flags: SuggestionFlags.release
        });
    },

    "when version param is a prerelease then returns 'latest' version package suggestion": () => {
      const testRelease = '1.0.0-beta.1';
      const actual = SuggestionFactory.createLatest(testRelease)
      assert.deepEqual(
        actual,
        {
          name: SuggestionStatus.LatestIsPrerelease,
          version: testRelease,
          flags: SuggestionFlags.prerelease
        });
    },

  },

}