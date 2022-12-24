import { IFrozenOptions } from 'core.configuration';
import { ICachingOptions, IHttpOptions, UrlHelpers } from 'core.clients';
import { ProviderSupport, IProviderConfig, TProviderFileMatcher } from 'core.providers';

import { ComposerContributions } from './definitions/eComposerContributions';

export class ComposerConfig implements IProviderConfig {

  constructor(config: IFrozenOptions, caching: ICachingOptions, http: IHttpOptions) {
    this.config = config;
    this.caching = caching;
    this.http = http;
  }

  config: IFrozenOptions;

  providerName: string = 'composer';

  supports: Array<ProviderSupport> = [
    ProviderSupport.Releases,
    ProviderSupport.Prereleases,
    ProviderSupport.InstalledStatuses,
  ];

  fileMatcher: TProviderFileMatcher = {
    language: 'json',
    scheme: 'file',
    pattern: '**/composer.json',
  };

  http: IHttpOptions;

  caching: ICachingOptions;

  get dependencyProperties(): Array<string> {
    return this.config.get(ComposerContributions.DependencyProperties);
  }

  get apiUrl(): string {
    return UrlHelpers.ensureEndSlash(this.config.get(ComposerContributions.ApiUrl));
  }

}