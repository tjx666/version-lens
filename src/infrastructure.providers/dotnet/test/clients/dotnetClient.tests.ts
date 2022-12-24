import Fixtures from './fixtures/dotnetSources'

import { LoggerStub } from 'test.core.logging';

import { ILogger } from 'core.logging';

import {
  UrlHelpers,
  ICachingOptions,
  CachingOptions,
  IHttpOptions,
  HttpOptions,
  IProcessClient
} from 'core.clients';

import {
  DotNetConfig,
  DotNetCli,
  INugetOptions,
  NugetOptions
} from 'infrastructure.providers.dotnet';

import { ProcessClient } from 'infrastructure.clients';

const { mock, instance, when, anything } = require('ts-mockito');

const assert = require('assert');

let cacheOptsMock: ICachingOptions;
let httpOptsMock: IHttpOptions;
let nugetOptsMock: INugetOptions;
let configMock: DotNetConfig;
let loggerMock: ILogger;

let clientMock: IProcessClient;

export const DotnetClientRequestTests = {

  beforeEach: () => {
    cacheOptsMock = mock(CachingOptions);
    httpOptsMock = mock(HttpOptions);
    nugetOptsMock = mock(NugetOptions);
    configMock = mock(DotNetConfig);
    loggerMock = mock(LoggerStub)
    clientMock = mock(ProcessClient)

    when(configMock.caching).thenReturn(instance(cacheOptsMock))
    when(configMock.http).thenReturn(instance(httpOptsMock))
    when(configMock.nuget).thenReturn(instance(nugetOptsMock))
  },

  "fetchSources": {

    "returns an Array<DotNetSource> of enabled sources": async () => {
      const testFeeds = [
        'https://test.feed/v3/index.json',
      ];

      const expected = [
        {
          enabled: true,
          machineWide: false,
          url: testFeeds[0],
          protocol: UrlHelpers.RegistryProtocols.https
        },
        {
          enabled: true,
          machineWide: false,
          url: 'https://api.nuget.org/v3/index.json',
          protocol: UrlHelpers.RegistryProtocols.https
        },
        {
          enabled: true,
          machineWide: false,
          url: 'http://non-ssl/v3/index.json',
          protocol: UrlHelpers.RegistryProtocols.http
        },
        {
          enabled: true,
          machineWide: true,
          url: 'C:\\Program Files (x86)\\Microsoft SDKs\\NuGetPackages\\',
          protocol: UrlHelpers.RegistryProtocols.file
        },
      ]

      when(clientMock.request(anything(), anything(), anything()))
        .thenResolve({
          data: Fixtures.enabledSources
        })

      when(nugetOptsMock.sources).thenReturn(testFeeds)

      const cut = new DotNetCli(
        instance(configMock),
        instance(clientMock),
        instance(loggerMock)
      );
      return cut.fetchSources('.')
        .then(actualSources => {
          assert.deepEqual(actualSources, expected);
        });

    },

    "return 0 items when no sources are enabled": async () => {
      const testFeeds = [];

      when(clientMock.request(
        anything(),
        anything(),
        anything()
      )).thenResolve({
        data: Fixtures.disabledSource
      })

      when(nugetOptsMock.sources).thenReturn(testFeeds)

      const cut = new DotNetCli(
        instance(configMock),
        instance(clientMock),
        instance(loggerMock)
      );

      return cut.fetchSources('.')
        .then(actualSources => {
          assert.equal(actualSources.length, 0);
        });
    },

    "returns only enabled sources when some sources are disabled": async () => {
      const expected = [
        {
          enabled: true,
          machineWide: false,
          url: 'https://api.nuget.org/v3/index.json',
          protocol: UrlHelpers.RegistryProtocols.https
        },
      ]

      when(clientMock.request(
        anything(),
        anything(),
        anything()
      )).thenResolve({
        data: Fixtures.enabledAndDisabledSources
      })

      when(nugetOptsMock.sources).thenReturn([])

      const cut = new DotNetCli(
        instance(configMock),
        instance(clientMock),
        instance(loggerMock)
      );

      return cut.fetchSources('.')
        .then(actualSources => {
          assert.deepEqual(actualSources, expected);
        });
    },

    "returns fallback url on error": async () => {
      const expectedFallbackNugetSource = 'http://fallbackurl.test.net'

      when(clientMock.request(
        anything(),
        anything(),
        anything()
      )).thenReject({
        data: Fixtures.invalidSources
      })

      when(configMock.fallbackNugetSource).thenReturn(expectedFallbackNugetSource)

      const cut = new DotNetCli(
        instance(configMock),
        instance(clientMock),
        instance(loggerMock)
      );

      const expectedErrorResp = {
        enabled: true,
        machineWide: false,
        protocol: 'https:',
        url: expectedFallbackNugetSource,
      }

      return cut.fetchSources('.')
        .then(actual => {
          assert.deepEqual(actual, [expectedErrorResp]);
        });
    },

  }

}