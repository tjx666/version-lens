import { TPromiseSpawnOptions, TPromiseSpawnResult } from "infrastructure.clients";

export class ProcessSpawnStub {

  promiseSpawn(
    cmd: string,
    args?: Array<string>,
    opts?: TPromiseSpawnOptions,
    // extra?: any
  ): Promise<TPromiseSpawnResult> {
    return Promise.resolve() as any;
  }

}