import {
  ICachingOptions,
  IHttpOptions,
  IHttpClient,
  IProcessClient
} from 'core.clients';

import { MavenConfig } from '../mavenConfig';
import { MavenSuggestionProvider } from '../mavenSuggestionProvider';
import { MvnCli } from '../clients/mvnCli';
import { MavenClient } from '../clients/mavenClient';

export interface IMavenContainerMap {

  // options
  mavenCachingOpts: ICachingOptions,

  mavenHttpOpts: IHttpOptions,

  // config
  mavenConfig: MavenConfig,

  // cli
  mvnProcess: IProcessClient,

  mvnCli: MvnCli

  // clients
  mavenHttpClient: IHttpClient,

  mavenClient: MavenClient,

  // provider
  mavenProvider: MavenSuggestionProvider
}