import { dirname } from 'path';

import {
  EventEmitter,
  TextDocument,
  CancellationToken,
  CodeLensProvider,
  CodeLens,
  Event,
  DocumentSelector
} from 'vscode';

import { ILogger } from 'core.logging';
import {
  ISuggestionProvider,
  SuggestionFlags,
  SuggestionStatus,
  defaultReplaceFn,
} from 'core.suggestions';
import { IProviderConfig } from 'core.providers';
import { PackageSourceTypes, PackageResponseErrors } from 'core.packages';

import {
  CommandFactory,
  VersionLens,
  VersionLensFactory,
  VersionLensExtension,
  VersionLensState
} from 'presentation.extension';

export class VersionLensProvider implements CodeLensProvider {

  constructor(
    extension: VersionLensExtension,
    suggestionProvider: ISuggestionProvider,
    logger: ILogger
  ) {
    this.extension = extension;
    this.suggestionProvider = suggestionProvider;
    this.logger = logger;

    this.notifyCodeLensesChanged = new EventEmitter();
    this.onDidChangeCodeLenses = this.notifyCodeLensesChanged.event;
  }

  notifyCodeLensesChanged: EventEmitter<void>;

  onDidChangeCodeLenses: Event<void>;

  extension: VersionLensExtension;

  suggestionProvider: ISuggestionProvider;

  logger: ILogger;

  get config(): IProviderConfig {
    return this.suggestionProvider.config;
  }

  get state(): VersionLensState {
    return this.extension.state;
  }

  get documentSelector(): DocumentSelector {
    return this.suggestionProvider.config.fileMatcher;
  }

  reloadCodeLenses() {
    this.notifyCodeLensesChanged.fire();
  }

  provideCodeLenses(
    document: TextDocument, token: CancellationToken
  ): Promise<Array<CodeLens>> {
    if (this.state.enabled.value === false) return null;

    // package path
    const packagePath = dirname(document.uri.fsPath);

    // clear any errors
    this.state.providerError.value = false;

    // set in progress
    this.state.providerBusy.value++;

    this.logger.info(
      "Analysing %s dependencies in %s",
      this.config.providerName,
      document.uri.fsPath
    );

    // unfreeze config per file request
    this.config.caching.defrost();

    this.logger.debug(
      "Caching duration is set to %s milliseconds",
      this.config.caching.duration
    );

    // get the dependencies
    const packageDeps = this.suggestionProvider.parseDependencies(document.getText());

    // fetch suggestions
    return this.suggestionProvider.fetchSuggestions(packagePath, packageDeps)
      .then(responses => {

        this.state.providerBusy.value--;

        if (responses === null) {
          this.logger.info(
            "No %s dependencies found in %s",
            this.config.providerName,
            document.uri.fsPath
          );
          return null;
        }

        this.logger.info(
          "Resolved %s %s dependencies",
          responses.length,
          this.config.providerName
        );

        if (this.state.prereleasesEnabled.value === false) {
          responses = responses.filter(
            function (response) {
              const { suggestion } = response;
              return (suggestion.flags & SuggestionFlags.prerelease) === 0 ||
                suggestion.name.includes(SuggestionStatus.LatestIsPrerelease);
            }
          )
        }

        return <any>VersionLensFactory.createFromPackageResponses(
          document,
          responses,
          this.suggestionProvider.suggestionReplaceFn || defaultReplaceFn
        );
      })
      .catch(error => {
        this.state.providerError.value = true;
        this.state.providerBusy.change(0)
        return Promise.reject(error);
      })
  }

  async resolveCodeLens(
    codeLens: CodeLens, token: CancellationToken
  ): Promise<CodeLens> {
    if (codeLens instanceof VersionLens) {
      // evaluate the code lens
      const evaluated = this.evaluateCodeLens(codeLens, token);

      // update the progress
      return Promise.resolve(evaluated);
    }
  }

  evaluateCodeLens(codeLens: VersionLens, token: CancellationToken) {
    if (codeLens.hasPackageSource(PackageSourceTypes.Directory))
      return CommandFactory.createDirectoryLinkCommand(codeLens);

    return CommandFactory.createSuggestedVersionCommand(codeLens)
  }

}