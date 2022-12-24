import { KeyStringDictionary } from 'core.generics';
import { ILogger } from 'core.logging';
import {
  AbstractCachedRequest,
  HttpClientResponse,
  IHttpClient,
  HttpClientRequestMethods,
  HttpRequestOptions,
  UrlHelpers,
} from 'core.clients';

import { IXhrResponse } from './definitions/iXhrResponse';


import { XHRRequest } from 'request-light'

export class HttpClient extends AbstractCachedRequest<number, string>
  implements IHttpClient {

  logger: ILogger;

  options: HttpRequestOptions;

  xhr: XHRRequest;

  constructor(xhr: XHRRequest, requestOptions: HttpRequestOptions, requestLogger: ILogger) {
    super(requestOptions.caching);
    this.logger = requestLogger;
    this.options = requestOptions;
    this.xhr = xhr;
  }

  async request(
    method: HttpClientRequestMethods,
    baseUrl: string,
    query: KeyStringDictionary = {},
    headers: KeyStringDictionary = {}
  ): Promise<HttpClientResponse> {

    const url = UrlHelpers.createUrl(baseUrl, query);
    const cacheKey = method + '_' + url;

    if (this.cache.cachingOpts.duration > 0 &&
      this.cache.hasExpired(cacheKey) === false) {
      const cachedResp = this.cache.get(cacheKey);
      if (cachedResp.rejected) return Promise.reject(cachedResp);
      return Promise.resolve(cachedResp);
    }

    return this.xhr({
      url,
      type: method,
      headers,
      strictSSL: this.options.http.strictSSL
    })
      .then((response: IXhrResponse) => {
        return this.createCachedResponse(
          cacheKey,
          response.status,
          response.responseText,
          false
        );
      })
      .catch((response: IXhrResponse) => {
        const result = this.createCachedResponse(
          cacheKey,
          response.status,
          response.responseText,
          true
        );
        return Promise.reject<HttpClientResponse>(result);
      });
  }

}