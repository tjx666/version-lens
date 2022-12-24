import { IFrozenOptions } from 'core.configuration';
import { ICachingOptions, IHttpOptions } from 'core.clients';
import { ProviderSupport, IProviderConfig, TProviderFileMatcher } from 'core.providers';

import { INugetOptions } from "./definitions/iNugetOptions";
import { DotNetContributions } from './definitions/eDotNetContributions';

export class DotNetConfig implements IProviderConfig {

  constructor(
    config: IFrozenOptions,
    dotnetCachingOpts: ICachingOptions,
    dotnetHttpOpts: IHttpOptions,
    nugetOpts: INugetOptions,
  ) {
    this.config = config;
    this.caching = dotnetCachingOpts;
    this.http = dotnetHttpOpts;
    this.nuget = nugetOpts;
  }

  config: IFrozenOptions;

  providerName: string = 'dotnet';

  supports: Array<ProviderSupport> = [
    ProviderSupport.Releases,
    ProviderSupport.Prereleases,
  ];

  fileMatcher: TProviderFileMatcher = {
    language: 'xml',
    scheme: 'file',
    pattern: '**/*.{csproj,fsproj,targets,props}',
  };

  caching: ICachingOptions;

  http: IHttpOptions;

  nuget: INugetOptions;

  get dependencyProperties(): Array<string> {
    return this.config.get(DotNetContributions.DependencyProperties);
  }

  get tagFilter(): Array<string> {
    return this.config.get(DotNetContributions.TagFilter);
  }

  get fallbackNugetSource(): string {
    return 'https://api.nuget.org/v3/index.json';
  }

}