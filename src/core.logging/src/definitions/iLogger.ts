import { LogLevelTypes } from "./eLogLevelTypes";
import { TChildLoggerOptions } from "./tChildLoggerOptions";

export interface ILogger {

  log(level: LogLevelTypes, message: string, ...splats: any): void;

  info(message: string, ...splats: any): void;

  debug(message: string, ...splats: any): void;

  error(message: string, ...splats: any): void;
  
  child(options: TChildLoggerOptions): ILogger;

}