import { ExpiryCacheMap } from '../caching/expiryCacheMap';

import { ICachingOptions } from "../definitions/iCachingOptions";
import {
  ClientResponse,
  ClientResponseSource
} from "../definitions/clientResponses";

export abstract class AbstractCachedRequest<TStatus, TData> {

  cache: ExpiryCacheMap<ClientResponse<TStatus, TData>>;

  constructor(cachingOpts: ICachingOptions) {
    this.cache = new ExpiryCacheMap(cachingOpts);
  }

  createCachedResponse(
    cacheKey: string,
    status: TStatus,
    data: TData,
    rejected: boolean = false,
    source: ClientResponseSource = ClientResponseSource.remote
  ): ClientResponse<TStatus, TData> {
    const cacheEnabled = this.cache.cachingOpts.duration > 0;

    if (cacheEnabled) {
      //  cache reponse (don't return, keep immutable)
      this.cache.set(
        cacheKey,
        {
          source: ClientResponseSource.cache,
          status,
          data,
          rejected
        }
      );
    }

    // return original fetched data
    return {
      source,
      status,
      data,
      rejected
    };
  }

}