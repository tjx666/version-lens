import { dirname, resolve } from 'path';
import { workspace, WorkspaceEdit, Disposable, env } from 'vscode';

import { ILogger } from 'core.logging';
import { PackageSourceTypes } from 'core.packages';

import { CommandHelpers, VersionLens } from 'presentation.extension';

import { VersionLensState } from '../state/versionLensState';
import { SuggestionCommandContributions } from '../definitions/eSuggestionCommandContributions';

export class SuggestionCommands {

  state: VersionLensState;

  logger: ILogger;

  constructor(state: VersionLensState, logger: ILogger) {
    this.state = state;
    this.logger = logger;
  }

  onUpdateDependencyCommand(codeLens: VersionLens, packageVersion: string) {
    if ((<any>codeLens).__replaced) return Promise.resolve();

    const edit = new WorkspaceEdit();
    edit.replace(codeLens.documentUrl, codeLens.replaceRange, packageVersion);

    return workspace.applyEdit(edit)
      .then(done => (<any>codeLens).__replaced = true);
  }

  onLinkCommand(codeLens: VersionLens) {

    if (codeLens.package.source !== PackageSourceTypes.Directory) {
      this.logger.error(
        "onLinkCommand can only open local directories.\nPackage: %o",
        codeLens.package
      );
      return;
    }

    const filePathToOpen = resolve(
      dirname(codeLens.documentUrl.fsPath),
      codeLens.package.resolved.version
    );

    env.openExternal(<any>('file:///' + filePathToOpen));
  }

}

export function registerSuggestionCommands(
  state: VersionLensState,
  subscriptions: Array<Disposable>,
  logger: ILogger
): SuggestionCommands {

  // create the dependency
  const suggestionCommands = new SuggestionCommands(state, logger);

  // register commands with vscode
  subscriptions.push(
    ...CommandHelpers.registerCommands(
      SuggestionCommandContributions,
      <any>suggestionCommands,
      logger
    )
  );

  return suggestionCommands;
}