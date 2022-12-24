import { ProcessClientResponse } from "./clientResponses";

export interface ProcessClientRequestFn {
  (
    cmd: string,
    args: Array<string>,
    cwd: string,
  ): Promise<ProcessClientResponse>
}

export interface IProcessClient {

  request: ProcessClientRequestFn;

}