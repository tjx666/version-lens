import { IProcessClient, ICachingOptions } from "core.clients";
import { ILogger } from "core.logging";
import { ProcessClient } from "./processClient";

export function createProcessClient(
  cachingOpts: ICachingOptions, logger: ILogger
): IProcessClient {

  return new ProcessClient(require('@npmcli/promise-spawn'), cachingOpts, logger);
}

