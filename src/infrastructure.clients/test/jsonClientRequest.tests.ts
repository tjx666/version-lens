import { LoggerStub } from 'test.core.logging'

import { ILogger } from 'core.logging'
import {
  ClientResponseSource,
  HttpClientRequestMethods,
  JsonHttpClient,
  CachingOptions,
  HttpOptions,
  IHttpOptions,
  ICachingOptions,
  IHttpClient,
} from 'core.clients'

import { HttpClient } from 'infrastructure.clients';

const { mock, instance, when, anything } = require('ts-mockito');

const assert = require('assert')

let cachingOptsMock: ICachingOptions;
let httpOptsMock: IHttpOptions;
let httpClientMock: IHttpClient;
let loggerMock: ILogger;

export const JsonClientRequestTests = {

  beforeEach: () => {
    cachingOptsMock = mock(CachingOptions);
    httpOptsMock = mock(HttpOptions);
    loggerMock = mock(LoggerStub);
    httpClientMock = mock(HttpClient);

    when(cachingOptsMock.duration).thenReturn(30000);
    when(httpOptsMock.strictSSL).thenReturn(true);
  },

  "requestJson": {

    "returns response as an object": async () => {
      const testUrl = 'https://test.url.example/path';
      const testQueryParams = {}
      const testResponse = {
        source: ClientResponseSource.remote,
        status: 404,
        data: '{ "item1": "not found" }',
      }

      const expectedCacheData = {
        source: ClientResponseSource.remote,
        status: testResponse.status,
        data: JSON.parse(testResponse.data),
      }

      when(
        httpClientMock.request(
          anything(),
          anything(),
          anything(),
          anything()
        )
      ).thenResolve(testResponse)

      const rut = new JsonHttpClient(instance(httpClientMock));
      await rut.request(
        HttpClientRequestMethods.get,
        testUrl,
        testQueryParams
      ).then(response => {
        assert.deepEqual(response, expectedCacheData);
      })
    },

  },

};