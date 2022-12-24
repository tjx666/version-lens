import {
  ICachingOptions,
  IHttpOptions,
  IJsonHttpClient
} from 'core.clients';

import { DubConfig } from '../dubConfig';
import { DubSuggestionProvider } from '../dubSuggestionProvider';
import { DubClient } from '../dubClient';

export interface IDubContainerMap {

  // options
  dubCachingOpts: ICachingOptions,

  dubHttpOpts: IHttpOptions,

  // config
  dubConfig: DubConfig,

  // clients
  dubJsonClient: IJsonHttpClient,

  dubClient: DubClient,

  // provider
  dubProvider: DubSuggestionProvider

}