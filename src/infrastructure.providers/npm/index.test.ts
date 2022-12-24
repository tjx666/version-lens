// pacoteClientApi tests
import * as PacoteApiClient from './test/pacoteClient/pacoteClient.tests';
import * as PacoteNpmRc from './test/pacoteClient/npmrc.tests';
export const PacoteApiClientTests = {
  PacoteApiClient,
  PacoteNpmRc,
}

import * as fetchGitHub from './test/githubClient/fetchGitHub.tests';
export const GitHubClientTests = {
  fetchGitHub,
}

import * as fetchRegistry from './test/npmPackageClient/fetchRegistry.tests';
import * as fetchDirectory from './test/npmPackageClient/fetchDirectory.tests';
import * as fetchGit from './test/npmPackageClient/fetchGit.tests';

export const NpmPackageClientTests = {
  fetchRegistry,
  fetchDirectory,
  fetchGit
}

import * as replaceGitVersion from './test/npmVersionUtils/replaceGitVersion.tests'
export const NpmVersionUtilsTests = {
  replaceGitVersion,
}