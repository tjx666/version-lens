import { IFrozenOptions } from "core.configuration";

export interface ICachingOptions extends IFrozenOptions {

  config: IFrozenOptions;

  duration: number;

}
