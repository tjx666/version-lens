import { IXhrResponse } from "infrastructure.clients";

export class RequestLightStub {
  xhr(opts): Promise<IXhrResponse> {
    return Promise.resolve({
      responseText: '',
      status: 0,
      headers: {}
    });
  }
}