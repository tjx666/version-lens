import { IConfig } from 'core.configuration';

import { SuggestionContributions } from '../definitions/eSuggestionContributions';

export class SuggestionsOptions {

  private config: IConfig;

  constructor(config: IConfig) {
    this.config = config;
  }

  get showOnStartup(): boolean {
    return this.config.get<boolean>(
      SuggestionContributions.ShowOnStartup
    );
  }

  get showPrereleasesOnStartup(): boolean {
    return this.config.get<boolean>(
      SuggestionContributions.ShowPrereleasesOnStartup
    );
  }

}