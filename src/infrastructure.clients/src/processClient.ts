import {
  AbstractCachedRequest,
  ClientResponseSource,
  ProcessClientResponse,
  IProcessClient,
  ICachingOptions
} from 'core.clients';
import { ILogger } from 'core.logging';

import { IPromiseSpawnFn } from './definitions/iPromiseSpawn';

export class ProcessClient extends AbstractCachedRequest<string, string>
  implements IProcessClient {

  promiseSpawn: IPromiseSpawnFn;

  logger: ILogger;

  constructor(promiseSpawnFn: IPromiseSpawnFn, processOpts: ICachingOptions, processLogger: ILogger) {
    super(processOpts);
    this.logger = processLogger;
    this.promiseSpawn = promiseSpawnFn;
  }

  async request(
    cmd: string, args: Array<string>, cwd: string
  ): Promise<ProcessClientResponse> {

    const cacheKey = `${cmd} ${args.join(' ')}`;

    if (this.cache.cachingOpts.duration > 0 &&
      this.cache.hasExpired(cacheKey) === false) {
      this.logger.debug('cached - %s', cacheKey);

      const cachedResp = this.cache.get(cacheKey);
      if (cachedResp.rejected) return Promise.reject(cachedResp);
      return Promise.resolve(cachedResp);
    }

    this.logger.debug('executing - %s', cacheKey);

    return this.promiseSpawn(cmd, args, { cwd, stdioString: true })
      .then(result => {
        return this.createCachedResponse(
          cacheKey,
          result.code,
          result.stdout,
          false,
          ClientResponseSource.local
        );
      }).catch(error => {
        const result = this.createCachedResponse(
          cacheKey,
          error.code,
          error.message,
          true,
          ClientResponseSource.local
        );
        return Promise.reject<ProcessClientResponse>(result);
      });

  }

}