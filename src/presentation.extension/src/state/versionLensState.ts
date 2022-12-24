import { StateContributions } from "../definitions/eStateContributions";
import { ContextState } from "./contextState";
import { VersionLensExtension } from "../versionLensExtension";

export class VersionLensState {

  // states
  enabled: ContextState<boolean>;
  prereleasesEnabled: ContextState<boolean>;
  installedStatusesEnabled: ContextState<boolean>;

  providerActive: ContextState<boolean>;
  providerBusy: ContextState<number>;
  providerError: ContextState<boolean>;

  providerSupportsPrereleases: ContextState<boolean>;
  providerSupportsInstalledStatuses: ContextState<boolean>;

  constructor(extension: VersionLensExtension) {

    this.enabled = new ContextState(
      StateContributions.Enabled,
      extension.suggestions.showOnStartup
    );

    this.prereleasesEnabled = new ContextState(
      StateContributions.PrereleasesEnabled,
      extension.suggestions.showPrereleasesOnStartup
    );

    this.installedStatusesEnabled = new ContextState(
      StateContributions.InstalledStatusesEnabled,
      extension.statuses.showOnStartup
    );

    this.providerActive = new ContextState(
      StateContributions.ProviderActive,
      false
    );

    this.providerBusy = new ContextState(
      StateContributions.ProviderBusy,
      0
    );

    this.providerError = new ContextState(
      StateContributions.ProviderError,
      false
    );

    this.providerSupportsPrereleases = new ContextState(
      StateContributions.ProviderSupportsPrereleases,
      false
    );

    this.providerSupportsInstalledStatuses = new ContextState(
      StateContributions.ProviderSupportsInstalledStatuses,
      false
    );

  }

}