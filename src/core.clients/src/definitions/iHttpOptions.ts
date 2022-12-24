import { IFrozenOptions } from "core.configuration";

export interface IHttpOptions extends IFrozenOptions {

  config: IFrozenOptions;

  strictSSL: boolean;

}
