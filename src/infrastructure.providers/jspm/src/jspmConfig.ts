import { IFrozenOptions } from 'core.configuration';
import { ICachingOptions, IHttpOptions } from 'core.clients';

import { NpmConfig, GitHubOptions } from 'infrastructure.providers.npm';

export class JspmConfig extends NpmConfig {

  constructor(
    config: IFrozenOptions,
    caching: ICachingOptions,
    http: IHttpOptions,
    github: GitHubOptions
  ) {
    super(config, caching, http, github);
  }

  providerName: string = 'jspm';

}