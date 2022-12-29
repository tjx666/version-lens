import {
  ICachingOptions,
  IHttpOptions,
} from 'core.clients';
import { IFrozenOptions } from 'core.configuration';
import {
  IProviderConfig,
  ProviderSupport,
  TProviderFileMatcher,
} from 'core.providers';
import minimatch = require('minimatch');

import { NpmContributions } from './definitions/eNpmContributions';
import { GitHubOptions } from './options/githubOptions';

export class NpmConfig implements IProviderConfig {

  constructor(
    config: IFrozenOptions,
    caching: ICachingOptions,
    http: IHttpOptions,
    github: GitHubOptions,
  ) {
    this.config = config;
    this.caching = caching;
    this.http = http;
    this.github = github;
  }

  config: IFrozenOptions;

  providerName: string = 'npm';

  supports: Array<ProviderSupport> = [
    ProviderSupport.Releases,
    ProviderSupport.Prereleases,
    ProviderSupport.InstalledStatuses,
  ];

  fileMatcher: TProviderFileMatcher = {
    language: 'json',
    scheme: 'file',
    pattern: (fileName) => this.jsonPatterns.some(p => minimatch(fileName, p)),
  };

  caching: ICachingOptions;

  http: IHttpOptions;

  github: GitHubOptions;

  get dependencyProperties(): Array<string> {
    return this.config.get(NpmContributions.DependencyProperties);
  }

  get jsonPatterns(): Array<string> {
    return this.config && this.config.get(NpmContributions.JsonPatterns);
  }

  get distTagFilter(): Array<string> {
    return this.config.get(NpmContributions.DistTagFilter);
  }

}