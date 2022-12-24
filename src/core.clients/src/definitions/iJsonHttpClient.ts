import { KeyStringDictionary } from 'core.generics';

import { HttpClientRequestMethods } from "./eHttpClientRequestMethods";
import { JsonClientResponse } from './clientResponses';

export interface TJsonClientRequestFn {

  (
    method: HttpClientRequestMethods,
    url: string,
    query: KeyStringDictionary,
    headers: KeyStringDictionary,
  ): Promise<JsonClientResponse>;

}

export interface IJsonHttpClient {

  request: TJsonClientRequestFn;

}