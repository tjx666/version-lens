import { UrlHelpers } from 'core.clients';

const assert = require('assert')

export const UrlHelpersTests = {

  "getProtocolFromUrl": {

    "parses http and https protocols": () => {
      const testUrls = [
        'https://test.url.example/path',
        'http://test.url.example/path'
      ]

      const expectedProtocols = [
        UrlHelpers.RegistryProtocols.https,
        UrlHelpers.RegistryProtocols.http
      ]

      testUrls.forEach((testUrl, testIndex) => {
        const actual = UrlHelpers.getProtocolFromUrl(testUrl)
        assert.equal(actual, expectedProtocols[testIndex], "Protocol did not match")
      })

    },

    "parses file protocols": () => {
      const testFolders = [
        'd:\\some\\path',
        '/d/some/path'
      ]

      testFolders.forEach((testFolder, testIndex) => {
        const actual = UrlHelpers.getProtocolFromUrl(testFolder)
        assert.equal(actual, UrlHelpers.RegistryProtocols.file, "Protocol did not match")
      })

    },

  },

  "ensureEndSlash": {

    "appends missing slashes": () => {
      const testUrls = [
        'https://test.url.example',
        'https://test.url.example/'
      ]

      const expectedUrls = [
        'https://test.url.example/',
        'https://test.url.example/'
      ]

      testUrls.forEach((testUrl, testIndex) => {
        const actual = UrlHelpers.ensureEndSlash(testUrl)
        assert.equal(actual, expectedUrls[testIndex], "End slash did not match")
      })

    },

  },

};