import { languages, Disposable } from 'vscode';

import { ILogger } from "core.logging";
import { ISuggestionProvider } from "core.suggestions";

import { VersionLensExtension, VersionLensProvider } from "presentation.extension";

export function registerVersionLensProviders(
  extension: VersionLensExtension,
  suggestionProviders: Array<ISuggestionProvider>,
  subscriptions: Array<Disposable>,
  logger: ILogger
): Array<VersionLensProvider> {

  const results = [];

  suggestionProviders.forEach(
    function (provider: ISuggestionProvider) {
      const versionLensProvider = new VersionLensProvider(
        extension,
        provider,
        logger.child({ namespace: `${provider.config.providerName} codelens` })
      );

      results.push(versionLensProvider);

      // register the codelens provider with vscode
      const sub = languages.registerCodeLensProvider(
        versionLensProvider.documentSelector,
        versionLensProvider
      );

      // give vscode the command disposable
      subscriptions.push(sub);
    }
  )

  return results;
}