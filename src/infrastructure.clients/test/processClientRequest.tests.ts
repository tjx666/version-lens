import { LoggerStub } from 'test.core.logging';

import { ILogger } from 'core.logging';
import { ClientResponseSource, CachingOptions, ICachingOptions } from 'core.clients'

import { ProcessClient } from 'infrastructure.clients'
import { ProcessSpawnStub } from './stubs/processSpawnStub';

const { mock, instance, when, anything } = require('ts-mockito');

const assert = require('assert')

let psMock: ProcessSpawnStub;
let cachingMock: ICachingOptions;
let loggerMock: ILogger;

export const ProcessClientRequestTests = {

  beforeEach: () => {
    cachingMock = mock(CachingOptions)
    loggerMock = mock(LoggerStub)
    psMock = mock(ProcessSpawnStub)
  },

  "requestJson": {

    "returns <ProcessClientResponse> when error occurs": async () => {

      when(cachingMock.duration).thenReturn(30000)

      when(psMock.promiseSpawn(anything(), anything(), anything()))
        .thenReject({
          code: "ENOENT",
          message: "spawn missing ENOENT"
        })

      const rut = new ProcessClient(
        instance(psMock).promiseSpawn,
        instance(cachingMock),
        instance(loggerMock)
      );

      return await rut.request(
        'missing',
        ['--ooppss'],
        '/'
      ).catch(response => {
        assert.equal(response.status, "ENOENT")
        assert.equal(response.data, "spawn missing ENOENT")
      })

    },

    "returns <ProcessClientResponse> and caches response": async () => {
      const testResponse = {
        source: ClientResponseSource.local,
        status: 0,
        data: '123\n',
        rejected: false
      }

      const expectedCacheData = {
        source: ClientResponseSource.cache,
        status: testResponse.status,
        data: testResponse.data,
        rejected: false
      }

      when(psMock.promiseSpawn(anything(), anything(), anything()))
        .thenResolve({
          code: 0,
          stdout: testResponse.data
        })

      when(cachingMock.duration).thenReturn(30000)

      const rut = new ProcessClient(
        instance(psMock).promiseSpawn,
        instance(cachingMock),
        instance(loggerMock)
      )

      await rut.request(
        'echo',
        ['123'],
        'd:\\'
      ).then(response => {
        assert.deepEqual(response, testResponse)
      })

      await rut.request(
        'echo',
        ['123'],
        'd:\\'
      ).then(response => {
        assert.deepEqual(response, expectedCacheData)
      })

    },

    "doesn't cache when duration is 0": async () => {
      const testKey = 'echo 123';
      const testResponse = {
        source: ClientResponseSource.local,
        status: 0,
        data: '123\n',
        rejected: false,
      }

      when(psMock.promiseSpawn(anything(), anything(), anything()))
        .thenResolve({
          code: 0,
          stdout: testResponse.data
        })

      when(cachingMock.duration).thenReturn(0)

      const rut = new ProcessClient(
        instance(psMock).promiseSpawn,
        instance(cachingMock),
        instance(loggerMock)
      )

      await rut.request(
        'echo',
        ['123'],
        'd:\\'
      ).then(response => {
        assert.deepEqual(response, testResponse)
      })

      await rut.request(
        'echo',
        ['123'],
        'd:\\'
      ).then(response => {
        assert.deepEqual(response, testResponse)

        const cachedData = rut.cache.get(testKey);
        assert.equal(cachedData, undefined);
      })

    },

  },

};