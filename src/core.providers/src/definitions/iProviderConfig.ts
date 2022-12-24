import { IFrozenOptions } from 'core.configuration';
import { ICachingOptions, IHttpOptions } from 'core.clients';

import { ProviderSupport } from './eProviderSupport';
import { TProviderFileMatcher } from './tProviderFileMatcher';

export interface IProviderConfig {

  config: IFrozenOptions;

  providerName: string;

  supports: Array<ProviderSupport>;

  fileMatcher: TProviderFileMatcher;

  caching: ICachingOptions;

  http: IHttpOptions;

}