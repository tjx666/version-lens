import { IConfig } from 'core.configuration';

import { StatusesContributions } from '../definitions/eStatusesContributions';

export class StatusesOptions {

  private config: IConfig;

  constructor(config: IConfig) {
    this.config = config;
  }

  get showOnStartup() {
    return this.config.get<boolean>(StatusesContributions.ShowOnStartup);
  }

  get installedColour() {
    return this.config.get<string>(StatusesContributions.InstalledColour);
  }

  get notInstalledColour() {
    return this.config.get<string>(StatusesContributions.NotInstalledColour);
  }

  get outdatedColour() {
    return this.config.get<string>(StatusesContributions.OutdatedColour);
  }

  get prereleaseInstalledColour() {
    return this.config.get<string>(StatusesContributions.prereleaseInstalledColour);
  }

}