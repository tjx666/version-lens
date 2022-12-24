import { IFrozenOptions, OptionsWithFallback } from 'core.configuration';
import { IHttpOptions, HttpContributions } from 'core.clients';
import { Nullable } from 'core.generics';

export class HttpOptions extends OptionsWithFallback implements IHttpOptions {

  constructor(
    config: IFrozenOptions,
    section: string,
    fallbackSection: Nullable<string> = null
  ) {
    super(config, section, fallbackSection);
  }

  get strictSSL(): boolean {
    return this.getOrDefault<boolean>(
      HttpContributions.StrictSSL,
      true
    );
  }

}