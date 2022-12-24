import { LoggerStub } from 'test.core.logging';

import {
  NpmConfig,
  NpmPackageClient,
  GitHubClient
} from 'infrastructure.providers.npm'

import { PacoteClient } from 'infrastructure.providers.npm';

const { mock, instance } = require('ts-mockito');

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

  'fetchPackage': {

    'returns a file:// directory package': async () => {
      const expectedSource = 'directory';

      const testRequest: any = {
        clientData: {
          providerName: 'testnpmprovider',
        },
        source: 'npmtest',
        package: {
          path: 'filepackagepath',
          name: 'filepackage',
          version: 'file://some/path/out/there',
        }
      }

      const cut = new NpmPackageClient(
        instance(configMock),
        instance(pacoteMock),
        instance(githubClientMock),
        instance(loggerMock)
      );

      return cut.fetchPackage(testRequest)
        .then(actual => {
          assert.equal(actual.source, 'directory', `expected to see ${expectedSource}`)
          assert.deepEqual(actual.requested, testRequest.package)
        })
    }

  }

}