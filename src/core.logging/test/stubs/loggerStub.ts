import { KeyDictionary } from 'core.generics';
import { ILogger, LogLevelTypes, TChildLoggerOptions } from 'core.logging';

export class LoggerStub implements ILogger {

  log(
    level: LogLevelTypes,
    message: string,
    splats: KeyDictionary<any>
  ): void { }

  info(message: string, ...splats: any): void { }

  debug(message: string, ...splats: any): void { }

  error(message: string, ...splats: any): void { }

  child(options: TChildLoggerOptions): ILogger {
    return this;
  }

}