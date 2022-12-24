import { OptionsWithFallback } from 'core.configuration'

const assert = require('assert')

export const OptionsWithFallbackTests = {

  "get": {

    "returns section.key value, fallback.key value": () => {
      const testMap = {
        'caching.duration': null,
        'dotnet.caching.duration': 1,

        'logging.level': 2,
        'dotnet.logging.level': null
      }

      const tests = [
        {
          section: 'dotnet.caching',
          fallback: 'caching',
          key: 'duration',
          expected: 1
        },
        {
          section: 'dotnet.logging',
          fallback: 'logging',
          key: 'level',
          expected: 2
        }
      ]

      tests.forEach(test => {

        const cot = new OptionsWithFallback(
          {
            get: k => testMap[k],
            defrost: () => null
          },
          test.section,
          test.fallback
        );

        const actual = cot.get(test.key);

        assert.equal(actual, test.expected);
      })
    },

  },

  "getOrDefault": {

    "returns section.key value, fallback.key value, default arg value": () => {
      const testMap = {
        'caching.duration': null,
        'dotnet.caching.duration': 1,

        'logging.level': 2,
        'dotnet.logging.level': null,

        'nuget.feeds': null,
        'dotnet.nuget.feeds': null
      }

      const tests = [
        {
          section: 'dotnet.caching',
          fallback: 'caching',
          key: 'duration',
          expected: 1
        },
        {
          section: 'dotnet.logging',
          fallback: 'logging',
          key: 'level',
          expected: 2
        },
        {
          section: 'dotnet.nuget',
          fallback: 'nuget',
          key: 'feeds',
          expected: 'default arg'
        }
      ]

      tests.forEach(test => {

        const cot = new OptionsWithFallback(
          {
            get: k => testMap[k],
            defrost: () => null
          },
          test.section,
          test.fallback
        );

        const actual = cot.getOrDefault(test.key, 'default arg');

        assert.equal(actual, test.expected);
      })

    },

  }

}