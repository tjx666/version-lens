import { IHttpOptions } from "./iHttpOptions";
import { ICachingOptions } from "./iCachingOptions";

export type HttpRequestOptions = {

    caching: ICachingOptions,

    http: IHttpOptions,

}