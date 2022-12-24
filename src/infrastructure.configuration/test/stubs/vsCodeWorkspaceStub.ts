import { IVsCodeWorkspace } from 'infrastructure.configuration';
import { IConfig } from 'core.configuration';

export class VsCodeWorkspaceStub implements IVsCodeWorkspace {
  getConfiguration(section: any): IConfig {
    return {
      get: (key: string) => { throw new Error("Not implemented"); }
    };
  }
}
