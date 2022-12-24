import { LoggerStub } from 'test.core.logging';
import { ClientResponseSource } from 'core.clients';
import { SuggestionFlags } from 'core.suggestions';

import {
  NpmPackageClient,
  NpmConfig,
  GitHubClient,
  PacoteClient
} from 'infrastructure.providers.npm';

const { mock, instance, when, anything } = require('ts-mockito');

const assert = require('assert')

let configMock: NpmConfig;
let pacoteMock: PacoteClient;
let githubClientMock: GitHubClient;
let loggerMock: LoggerStub;

export default {

  beforeEach: () => {
    configMock = mock(NpmConfig);
    pacoteMock = mock(PacoteClient);
    githubClientMock = mock(GitHubClient);
    loggerMock = mock(LoggerStub);
  },

  'fetchGitPackage': {

    'returns fixed package for git:// requests': async () => {

      const testRequest: any = {
        clientData: {
          providerName: 'testnpmprovider',
        },
        package: {
          path: 'packagepath',
          name: 'core.js',
          version: 'git+https://git@github.com/testuser/test.git',
        }
      };

      when(pacoteMock.fetchPackage(anything(), anything()))
        .thenResolve({
          status: 200,
          data: '',
          source: ClientResponseSource.remote
        })

      // setup initial call
      const cut = new NpmPackageClient(
        instance(configMock),
        instance(pacoteMock),
        instance(githubClientMock),
        instance(loggerMock)
      );

      return cut.fetchPackage(testRequest)
        .then((actual) => {
          assert.equal(actual.source, 'git')
          assert.equal(actual.resolved, null)
          assert.deepEqual(actual.requested, testRequest.package)

          assert.deepEqual(
            actual.suggestions,
            [
              {
                name: 'fixed',
                version: 'git repository',
                flags: SuggestionFlags.status
              }
            ]
          )

        })

    },

    'returns unsupported suggestion when not github': async () => {

      const testRequest: any = {
        clientData: {
          providerName: 'testnpmprovider',
        },
        package: {
          path: 'packagepath',
          name: 'core.js',
          version: 'git+https://git@not-gihub.com/testuser/test.git',
        }
      };

      // setup initial call
      const cut = new NpmPackageClient(
        instance(configMock),
        instance(pacoteMock),
        instance(githubClientMock),
        instance(loggerMock)
      );

      return cut.fetchPackage(testRequest)
        .then((actual) => {
          assert.deepEqual(
            actual.suggestions,
            [
              {
                name: 'not supported',
                version: '',
                flags: SuggestionFlags.status
              }
            ]
          )
        })

    }

  }



}