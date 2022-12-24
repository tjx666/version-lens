import { KeyStringDictionary } from 'core.generics';

import {
  HttpClientResponse,
  JsonClientResponse,
  HttpClientRequestMethods,
  IJsonHttpClient,
  IHttpClient
} from 'core.clients';

export class JsonHttpClient implements IJsonHttpClient {

  httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async request(
    method: HttpClientRequestMethods,
    url: string,
    query: KeyStringDictionary = {},
    headers: KeyStringDictionary = {}
  ): Promise<JsonClientResponse> {

    return this.httpClient.request(method, url, query, headers)
      .then(function (response: HttpClientResponse) {
        return {
          source: response.source,
          status: response.status,
          data: JSON.parse(response.data),
        }
      });

  }

}