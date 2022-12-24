import { IPacote } from "infrastructure.providers.npm";

export class PacoteStub implements IPacote {

  packument(spec: any, opts: any): Promise<any> {
    throw new Error("Not implemented")
  }

}