import { IFrozenOptions, OptionsWithFallback } from 'core.configuration';
import { Nullable } from 'core.generics';

import { CachingContributions } from '../definitions/eCachingContributions';
import { ICachingOptions } from "../definitions/iCachingOptions";

export class CachingOptions extends OptionsWithFallback
  implements ICachingOptions {

  constructor(
    config: IFrozenOptions,
    section: string,
    fallbackSection: Nullable<string> = null
  ) {
    super(config, section, fallbackSection);
  }

  get duration(): number {
    const durationMin = this.getOrDefault<number>(
      CachingContributions.CacheDuration,
      0
    );
    // convert to milliseconds
    return durationMin * 60000;
  }

}