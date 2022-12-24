import { ICachingOptions, IHttpOptions, UrlHelpers } from 'core.clients';
import { IFrozenOptions } from 'core.configuration';
import { ProviderSupport, IProviderConfig, TProviderFileMatcher } from 'core.providers';

import { PubContributions } from './definitions/ePubContributions';

export class PubConfig implements IProviderConfig {

  constructor(config: IFrozenOptions, caching: ICachingOptions, http: IHttpOptions) {
    this.config = config;
    this.caching = caching;
    this.http = http;
  }

  config: IFrozenOptions;

  providerName: string = 'pub';

  supports: Array<ProviderSupport> = [
    ProviderSupport.Releases,
    ProviderSupport.Prereleases,
  ];

  fileMatcher: TProviderFileMatcher = {
    language: "yaml",
    scheme: "file",
    pattern: "**/pubspec.yaml",
  };

  caching: ICachingOptions;

  http: IHttpOptions;

  get dependencyProperties(): Array<string> {
    return this.config.get(PubContributions.DependencyProperties);
  }

  get apiUrl(): string {
    return UrlHelpers.ensureEndSlash(this.config.get(PubContributions.ApiUrl));
  }

}