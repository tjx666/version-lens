// vscode references
import { basename } from 'path';
import * as minimatch from 'minimatch';

import * as VsCodeTypes from 'vscode';

import { ILogger } from 'core.logging';

import { CommandHelpers, VersionLensProvider } from 'presentation.extension';

import { IconCommandContributions } from '../definitions/eIconCommandContributions';
import * as InstalledStatusHelpers from '../helpers/installedStatusHelpers';
import { VersionLensState } from '../state/versionLensState';

export class IconCommands {

  state: VersionLensState;

  outputChannel: VsCodeTypes.OutputChannel;

  versionLensProviders: Array<VersionLensProvider>;

  constructor(
    state: VersionLensState,
    outputChannel: VsCodeTypes.OutputChannel,
    versionLensProviders: Array<VersionLensProvider>
  ) {
    this.state = state;
    this.outputChannel = outputChannel;
    this.versionLensProviders = versionLensProviders;
  }

  onShowError(resourceUri: VsCodeTypes.Uri) {
    return Promise.all([
      this.state.providerError.change(false),
      this.state.providerBusy.change(0)
    ])
      .then(_ => {
        this.outputChannel.show();
      });
  }

  onShowVersionLenses(resourceUri: VsCodeTypes.Uri) {
    this.state.enabled.change(true)
      .then(_ => {
        this.refreshActiveCodeLenses();
      });
  }

  onHideVersionLenses(resourceUri: VsCodeTypes.Uri) {
    this.state.enabled.change(false)
      .then(_ => {
        this.refreshActiveCodeLenses();
      });
  }

  onShowPrereleaseVersions(resourceUri: VsCodeTypes.Uri) {
    this.state.prereleasesEnabled.change(true)
      .then(_ => {
        this.refreshActiveCodeLenses();
      });
  }

  onHidePrereleaseVersions(resourceUri: VsCodeTypes.Uri) {
    this.state.prereleasesEnabled.change(false)
      .then(_ => {
        this.refreshActiveCodeLenses();
      });
  }

  onShowInstalledStatuses(resourceUri: VsCodeTypes.Uri) {
    this.state.installedStatusesEnabled.change(true)
      .then(_ => {
        this.refreshActiveCodeLenses();
      });
  }

  onHideInstalledStatuses(resourceUri: VsCodeTypes.Uri) {
    this.state.installedStatusesEnabled.change(false)
      .then(_ => {
        InstalledStatusHelpers.clearDecorations();
      });
  }

  onShowingProgress(resourceUri: VsCodeTypes.Uri) { }

  refreshActiveCodeLenses() {
    const { window } = require('vscode');
    const fileName = window.activeTextEditor.document.fileName;
    const providers = filtersProvidersByFileName(
      fileName,
      this.versionLensProviders
    )
    if (!providers) return false;

    providers.forEach(
      provider => {
        provider.reloadCodeLenses()
      }
    );

    return true;
  }

}

export function filtersProvidersByFileName(
  fileName: string,
  providers: Array<VersionLensProvider>
): Array<VersionLensProvider> {

  const filename = basename(fileName);

  const filtered = providers.filter(
    provider => minimatch(filename, provider.config.fileMatcher.pattern)
  );

  if (filtered.length === 0) return [];

  return filtered;
}


export function registerIconCommands(
  state: VersionLensState,
  versionLensProviders: Array<VersionLensProvider>,
  subscriptions: Array<VsCodeTypes.Disposable>,
  outputChannel: VsCodeTypes.OutputChannel,
  logger: ILogger
): IconCommands {

  // create the dependency
  const iconCommands = new IconCommands(
    state,
    outputChannel,
    versionLensProviders
  );

  // register commands with vscode
  subscriptions.push(
    ...CommandHelpers.registerCommands(
      IconCommandContributions,
      <any>iconCommands,
      logger
    )
  );

  return iconCommands;
}