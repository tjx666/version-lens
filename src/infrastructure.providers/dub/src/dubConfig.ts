import { IFrozenOptions } from 'core.configuration';
import { ICachingOptions, IHttpOptions, UrlHelpers } from 'core.clients';
import { ProviderSupport, IProviderConfig, TProviderFileMatcher } from 'core.providers';

import { DubContributions } from './definitions/eDubContributions';

export class DubConfig implements IProviderConfig {

  constructor(config: IFrozenOptions, caching: ICachingOptions, http: IHttpOptions) {
    this.config = config;
    this.caching = caching;
    this.http = http;
  }

  config: IFrozenOptions;

  providerName: string = 'dub';

  supports: Array<ProviderSupport> = [
    ProviderSupport.Releases,
    ProviderSupport.Prereleases,
    ProviderSupport.InstalledStatuses,
  ];

  fileMatcher: TProviderFileMatcher = {
    language: 'json',
    scheme: 'file',
    pattern: '**/{dub.json,dub.selections.json}',
  };

  caching: ICachingOptions;

  http: IHttpOptions;

  get dependencyProperties(): Array<string> {
    return this.config.get(DubContributions.DependencyProperties);
  }

  get apiUrl(): string {
    return UrlHelpers.ensureEndSlash(this.config.get(DubContributions.ApiUrl));
  }

}