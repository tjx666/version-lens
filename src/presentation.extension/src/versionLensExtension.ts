import { IFrozenOptions } from 'core.configuration';

import { VersionLensState } from "presentation.extension";

import { SuggestionsOptions } from "./options/suggestionsOptions";
import { StatusesOptions } from "./options/statusesOptions";

export class VersionLensExtension {

  static extensionName: string = 'VersionLens';

  config: IFrozenOptions;

  suggestions: SuggestionsOptions;

  statuses: StatusesOptions;

  state: VersionLensState;

  constructor(rootConfig: IFrozenOptions) {
    this.config = rootConfig;

    this.suggestions = new SuggestionsOptions(rootConfig);
    this.statuses = new StatusesOptions(rootConfig);

    // instantiate setContext options
    this.state = new VersionLensState(this);
  }

}