import {
  HttpRequestOptions,
  IHttpClient,
  IJsonHttpClient,
  JsonHttpClient
} from "core.clients";
import { ILogger } from "core.logging";
import { HttpClient } from "./httpClient";

export function createHttpClient(
  options: HttpRequestOptions, logger: ILogger
): IHttpClient {
  return new HttpClient(require('request-light').xhr, options, logger);
}

export function createJsonClient(
  options: HttpRequestOptions, logger: ILogger
): IJsonHttpClient {
  return new JsonHttpClient(createHttpClient(options, logger));
}