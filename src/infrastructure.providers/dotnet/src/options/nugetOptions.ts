import { IFrozenOptions, Options } from 'core.configuration';
import { NugetContributions } from '../definitions/eNugetContributions';
import { INugetOptions } from '../definitions/iNugetOptions';

export class NugetOptions extends Options implements INugetOptions {

  constructor(config: IFrozenOptions, section: string) {
    super(config, section);
  }

  get sources(): Array<string> {
    return this.get<Array<string>>(NugetContributions.Sources);
  }

}