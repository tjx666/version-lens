import { Nullable } from 'core.generics';
import { IFrozenOptions, Options, IOptionsWithDefaults } from 'core.configuration';

export class OptionsWithFallback extends Options
  implements IOptionsWithDefaults {

  protected fallbackSection: Nullable<string>;

  constructor(config: IFrozenOptions, section: string, fallbackSection: Nullable<string> = null) {
    super(config, section);
    this.fallbackSection = fallbackSection;
  }

  get<T>(key: string): T {
    // attempt to get the section value
    const sectionValue: T = this.config.get(`${this.section}${key}`);

    // return section value
    if (sectionValue !== null && sectionValue !== undefined) return sectionValue;

    // attempt to get fallback section value
    let fallbackSectionValue: T;
    if (this.fallbackSection !== null) {
      fallbackSectionValue = this.config.get(`${this.fallbackSection}.${key}`);
    }

    // return fallback key value
    return fallbackSectionValue;
  }

  getOrDefault<T>(key: string, defaultValue: T): T {
    // attempt to get the section value
    const value: T = this.get(key);

    // return key value
    if (value !== null && value !== undefined) return value;

    // return default value
    return defaultValue;
  }

}