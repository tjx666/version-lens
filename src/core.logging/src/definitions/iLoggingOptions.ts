import { IFrozenOptions } from "core.configuration";

import { LogLevelTypes } from "./eLogLevelTypes";

export interface ILoggingOptions extends IFrozenOptions {

  level: LogLevelTypes;

  timestampFormat: string;

}