import {
  ICachingOptions,
  IHttpOptions,
  IProcessClient,
  IJsonHttpClient
} from 'core.clients';

import { DotNetConfig } from '../dotnetConfig';
import { DotNetSuggestionProvider } from '../dotnetSuggestionProvider';
import { NugetOptions } from '../options/nugetOptions';
import { DotNetCli } from '../clients/dotnetCli';
import { NuGetResourceClient } from '../clients/nugetResourceClient';
import { NuGetPackageClient } from '../clients/nugetPackageClient';

export interface IDotNetContainerMap {
  // options
  nugetOpts: NugetOptions,

  dotnetCachingOpts: ICachingOptions,

  dotnetHttpOpts: IHttpOptions,

  // config
  dotnetConfig: DotNetConfig,

  // cli
  dotnetProcess: IProcessClient,

  dotnetCli: DotNetCli,

  // clients
  dotnetJsonClient: IJsonHttpClient,

  nugetClient: NuGetPackageClient,

  nugetResClient: NuGetResourceClient,

  // provider
  dotnetProvider: DotNetSuggestionProvider

}