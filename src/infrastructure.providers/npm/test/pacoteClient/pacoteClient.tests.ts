import { LoggerStub } from 'test.core.logging';

import { ILogger } from 'core.logging';
import { SuggestionFlags } from 'core.suggestions';

import {
  ICachingOptions,
  CachingOptions,
  IHttpOptions,
  HttpOptions
} from 'core.clients';

import {
  NpmConfig,
  PacoteClient,
  GitHubOptions,
  IPacote
} from 'infrastructure.providers.npm'

import { VersionLensExtension } from 'presentation.extension';

import Fixtures from './pacoteClient.fixtures'
import { PacoteStub } from '../stubs/pacoteStub';

const { mock, instance, when, anything, capture } = require('ts-mockito');

const assert = require('assert')
const npa = require('npm-package-arg');

let cachingOptsMock: ICachingOptions;
let githubOptsMock: GitHubOptions;
let loggerMock: ILogger;
let configMock: NpmConfig;
let pacoteMock: IPacote;

export default {

  beforeEach: () => {
    githubOptsMock = mock(GitHubOptions);
    cachingOptsMock = mock(CachingOptions)
    configMock = mock(NpmConfig)
    loggerMock = mock(LoggerStub)
    pacoteMock = mock(PacoteStub)

    when(configMock.caching).thenReturn(instance(cachingOptsMock))
    when(configMock.github).thenReturn(instance(githubOptsMock))
  },

  'fetchPackage': {

    'returns a registry range package': async () => {

      const testRequest: any = {
        clientData: {
          providerName: 'testnpmprovider',
        },
        package: {
          path: 'packagepath',
          name: 'pacote',
          version: '10.1.*',
        }
      }

      const npaSpec = npa.resolve(
        testRequest.package.name,
        testRequest.package.version,
        testRequest.package.path
      );

      when(pacoteMock.packument(anything(), anything()))
        .thenResolve(Fixtures.packumentRegistryRange)

      const cut = new PacoteClient(
        instance(configMock),
        instance(loggerMock)
      )

      cut.pacote = instance(pacoteMock)

      return cut.fetchPackage(testRequest, npaSpec)
        .then((actual) => {
          assert.equal(actual.source, 'registry')
          assert.equal(actual.type, 'range')
          assert.equal(actual.resolved.name, testRequest.package.name)
          assert.deepEqual(actual.requested, testRequest.package)
        })
    },

    'returns a registry version package': async () => {

      const testRequest: any = {
        clientData: {
          providerName: 'testnpmprovider',
        },
        package: {
          path: 'packagepath',
          name: 'npm-package-arg',
          version: '8.0.1',
        }
      }

      const npaSpec = npa.resolve(
        testRequest.package.name,
        testRequest.package.version,
        testRequest.package.path
      );

      when(pacoteMock.packument(anything(), anything()))
        .thenResolve(Fixtures.packumentRegistryVersion)

      const cut = new PacoteClient(
        instance(configMock),
        instance(loggerMock)
      )

      cut.pacote = instance(pacoteMock)

      return cut.fetchPackage(testRequest, npaSpec)
        .then((actual) => {
          assert.equal(actual.source, 'registry')
          assert.equal(actual.type, 'version')
          assert.equal(actual.resolved.name, testRequest.package.name)
        })
    },

    'returns capped latest versions': async () => {

      const testRequest: any = {
        clientData: {
          providerName: 'testnpmprovider',
        },
        package: {
          path: 'packagepath',
          name: 'npm-package-arg',
          version: '7.0.0',
        }
      }

      const npaSpec = npa.resolve(
        testRequest.package.name,
        testRequest.package.version,
        testRequest.package.path
      );

      when(pacoteMock.packument(anything(), anything()))
        .thenResolve(Fixtures.packumentCappedToLatestTaggedVersion)

      const cut = new PacoteClient(
        instance(configMock),
        instance(loggerMock)
      )

      cut.pacote = instance(pacoteMock)

      return cut.fetchPackage(testRequest, npaSpec)
        .then((actual) => {
          assert.deepEqual(actual.suggestions, [{
            name: 'latest',
            version: '',
            flags: SuggestionFlags.status
          }])
        })
    },

    'returns a registry alias package': async () => {
      const testRequest: any = {
        clientData: {
          providerName: 'testnpmprovider',
        },
        package: {
          path: 'packagepath',
          name: 'aliased',
          version: 'npm:pacote@11.1.9',
        }
      }

      const npaSpec = npa.resolve(
        testRequest.package.name,
        testRequest.package.version,
        testRequest.package.path
      );

      when(pacoteMock.packument(anything(), anything()))
        .thenResolve(Fixtures.packumentRegistryAlias)

      const cut = new PacoteClient(
        instance(configMock),
        instance(loggerMock)
      )

      cut.pacote = instance(pacoteMock)

      return cut.fetchPackage(testRequest, npaSpec)
        .then((actual) => {
          assert.equal(actual.source, 'registry')
          assert.equal(actual.type, 'alias')
          assert.equal(actual.requested.name, testRequest.package.name)
          assert.equal(actual.resolved.name, 'pacote')
          assert.deepEqual(actual.requested, testRequest.package)
        })
    },

  }

}