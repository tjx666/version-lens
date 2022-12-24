import { LoggerStub } from 'test.core.logging'

import { ILogger } from 'core.logging';
import { KeyStringDictionary } from 'core.generics'
import {
  ClientResponseSource,
  UrlHelpers,
  HttpClientRequestMethods,
  HttpRequestOptions,
  ICachingOptions,
  IHttpOptions,
  CachingOptions,
  HttpOptions
} from 'core.clients'

import { HttpClient } from 'infrastructure.clients'

import { RequestLightStub } from './stubs/requestLightStub';

const {
  mock,
  instance,
  when,
  capture,
  anything
} = require('ts-mockito');

const assert = require('assert')

let cachingOptsMock: ICachingOptions;
let httpOptsMock: IHttpOptions;
let loggerMock: ILogger;
let requestLightMock: RequestLightStub;

let rut: HttpClient;

export const HttpRequestTests = {

  beforeEach: () => {
    cachingOptsMock = mock(CachingOptions);
    httpOptsMock = mock(HttpOptions);
    loggerMock = mock(LoggerStub);
    requestLightMock = mock(RequestLightStub);

    rut = new HttpClient(
      instance(requestLightMock).xhr,
      <HttpRequestOptions>{
        caching: instance(cachingOptsMock),
        http: instance(httpOptsMock)
      },
      instance(loggerMock)
    );

    when(cachingOptsMock.duration).thenReturn(30000);
    when(httpOptsMock.strictSSL).thenReturn(true);
  },

  "request": {

    "passes options to xhr": async () => {

      const testFlags = [
        { testStrictSSL: true, testDuration: 3000 },
        { testStrictSSL: false, testDuration: 0 },
      ];

      when(requestLightMock.xhr(anything()))
        .thenResolve({
          responseText: '{}',
          status: 200
        })

      const promised = []

      testFlags.forEach(async (test, testIndex) => {
        when(cachingOptsMock.duration).thenReturn(test.testDuration);
        when(httpOptsMock.strictSSL).thenReturn(test.testStrictSSL);

        const rut = new HttpClient(
          instance(requestLightMock).xhr,
          <HttpRequestOptions>{
            caching: instance(cachingOptsMock),
            http: instance(httpOptsMock)
          },
          instance(loggerMock)
        );

        promised.push(
          rut.request(HttpClientRequestMethods.get, 'anywhere')
            .then(() => {
              const [actualOpts] = capture(requestLightMock.xhr).byCallIndex(testIndex);
              assert.equal(actualOpts.strictSSL, test.testStrictSSL);
            })
        )
      })

      return Promise.all(promised)
    },

    "generates the expected url with query params": async () => {
      const testUrl = 'https://test.url.example/path';

      const testQueryParams = [
        {},
        { param1: 1, param2: 2 }
      ]

      when(requestLightMock.xhr(anything()))
        .thenResolve({
          status: 200,
          responseText: null
        })

      await Promise.all(

        testQueryParams.map(
          async function (query: KeyStringDictionary, index) {
            const expectedUrl = UrlHelpers.createUrl(testUrl, query);

            await rut.request(
              HttpClientRequestMethods.get,
              testUrl,
              query
            ).then(() => {
              const [actualOpts] = capture(requestLightMock.xhr).byCallIndex(index);
              assert.equal(actualOpts.url, expectedUrl);
              assert.equal(actualOpts.type, HttpClientRequestMethods.get);
            })

          }
        )
      )

    },

    "caches url response on success": async () => {
      const testUrl = 'https://test.url.example/path';
      const testQueryParams = {}
      const testResponse = {
        source: ClientResponseSource.remote,
        status: 200,
        responseText: "cached test",
      };

      const expectedCacheData = {
        source: ClientResponseSource.cache,
        status: testResponse.status,
        data: testResponse.responseText,
        rejected: false
      }

      when(requestLightMock.xhr(anything())).thenResolve(testResponse)

      await rut.request(
        HttpClientRequestMethods.get,
        testUrl,
        testQueryParams
      ).then(response => {
        const cachedData = rut.cache.get('GET_' + testUrl);
        assert.deepEqual(cachedData, expectedCacheData);
      })
    },

    "caches url response when rejected": async () => {
      const testUrl = 'https://test.url.example/path';
      const testQueryParams = {}
      const testResponse = {
        status: 404,
        responseText: "not found",
        source: ClientResponseSource.remote
      };

      const expectedCacheData = {
        status: testResponse.status,
        data: testResponse.responseText,
        source: ClientResponseSource.cache,
        rejected: true,
      }

      when(requestLightMock.xhr(anything())).thenResolve(testResponse)

      // first request
      await rut.request(
        HttpClientRequestMethods.get,
        testUrl,
        testQueryParams
      ).catch(response => {
        const cachedData = rut.cache.get('GET_' + testUrl);
        assert.deepEqual(cachedData, expectedCacheData);
      })

      // accessing a cached rejection should also reject
      await rut.request(
        HttpClientRequestMethods.get,
        testUrl,
        testQueryParams
      ).catch(response => {
        const cachedData = rut.cache.get('GET_' + testUrl);
        assert.deepEqual(cachedData, expectedCacheData);
      })

    },

    "does not cache when duration is 0": async () => {
      const testUrl = 'https://test.url.example/path';
      const testQueryParams = {}
      const expectedCacheData = undefined;

      when(requestLightMock.xhr(anything()))
        .thenResolve({
          status: 200,
          responseText: JSON.stringify({ "message": "cached test" })
        });

      when(cachingOptsMock.duration).thenReturn(0);
      when(httpOptsMock.strictSSL).thenReturn(true);

      await rut.request(
        HttpClientRequestMethods.get,
        testUrl,
        testQueryParams
      ).then(response => {
        const cachedData = rut.cache.get('GET_' + testUrl);
        assert.equal(cachedData, expectedCacheData);
      })
    },

  },

};