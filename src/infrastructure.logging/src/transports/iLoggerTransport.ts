import { ILoggingOptions } from "core.logging";

export interface ILoggerTransport {

  name: string;

  logging: ILoggingOptions;

  updateLevel();

}