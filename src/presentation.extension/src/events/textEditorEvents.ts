import { window, TextEditor } from 'vscode';

import { ProviderSupport } from 'core.providers';
import { ISuggestionProvider, filtersProvidersByFileName } from 'core.suggestions';

import { ILoggerTransport } from 'infrastructure.logging';

import { VersionLensState } from '../state/versionLensState';

export class TextEditorEvents {

  constructor(
    state: VersionLensState,
    suggestionProviders: Array<ISuggestionProvider>,
    loggerTransport: ILoggerTransport
  ) {
    this.state = state;
    this.suggestionProviders = suggestionProviders;
    this.loggerTransport = loggerTransport;

    // register editor events
    window.onDidChangeActiveTextEditor(
      this.onDidChangeActiveTextEditor.bind(this)
    );
  }

  state: VersionLensState;

  suggestionProviders: Array<ISuggestionProvider>;

  loggerTransport: ILoggerTransport;

  onDidChangeActiveTextEditor(textEditor: TextEditor) {
    // maintain versionLens.providerActive state
    // each time the active editor changes

    if (!textEditor) {
      // disable icons when no editor
      this.state.providerActive.value = false;
      return;
    }

    if (textEditor.document.uri.scheme !== 'file') return;

    const providersMatchingFilename = filtersProvidersByFileName(
      textEditor.document.fileName,
      this.suggestionProviders
    );

    if (providersMatchingFilename.length === 0) {
      // disable icons if no match found
      this.state.providerActive.value = false;
      return;
    }

    // ensure the latest logging level is set
    this.loggerTransport.updateLevel();

    // determine prerelease support
    const providerSupportsPrereleases = providersMatchingFilename.reduce(
      (v, p) => p.config.supports.includes(ProviderSupport.Prereleases)
      , false
    );

    // determine installed statuses support
    const providerSupportsInstalledStatuses = providersMatchingFilename.reduce(
      (v, p) => p.config.supports.includes(ProviderSupport.InstalledStatuses)
      , false
    );

    this.state.providerSupportsPrereleases.value = providerSupportsPrereleases;
    this.state.providerSupportsInstalledStatuses.value = providerSupportsInstalledStatuses;
    this.state.providerActive.value = true;
  }

}