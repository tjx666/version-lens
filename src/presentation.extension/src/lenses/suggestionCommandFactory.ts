import { SuggestionFlags } from 'core.suggestions';

import {
  SuggestionIndicators,
  VersionLens,
  SuggestionCommandContributions
} from 'presentation.extension';

export function createErrorCommand(errorMsg, codeLens) {
  return codeLens.setCommand(`${errorMsg}`);
}

export function createTagCommand(tag, codeLens) {
  return codeLens.setCommand(tag);
}

export function createDirectoryLinkCommand(codeLens) {
  let title;
  let cmd = SuggestionCommandContributions.LinkCommand;
  const path = require('path');
  const fs = require('fs');
  const filePath = path.resolve(path.dirname(codeLens.documentUrl.fsPath), codeLens.package.suggestion.version);
  const fileExists = fs.existsSync(filePath);
  if (fileExists === false)
    title = (cmd = null) || 'Specified resource does not exist';
  else
    title = `${SuggestionIndicators.OpenNewWindow} ${codeLens.package.requested.version}`;

  return codeLens.setCommand(title, cmd, [codeLens]);
}

export function createSuggestedVersionCommand(codeLens: VersionLens) {
  const { name, version, flags } = codeLens.package.suggestion;
  const isStatus = (flags & SuggestionFlags.status);
  const isTag = (flags & SuggestionFlags.tag);
  const isPrerelease = flags & SuggestionFlags.prerelease;

  if (!isStatus) {
    const replaceWithVersion: string = isPrerelease || isTag ?
      version :
      codeLens.replaceVersionFn(codeLens.package, version);

    const prefix = isTag ? '' : name + ': ';
    return codeLens.setCommand(

      `${prefix}${SuggestionIndicators.Update} ${version}`,
      SuggestionCommandContributions.UpdateDependencyCommand,
      [codeLens, `${replaceWithVersion}`]
    );
  }

  // show the status
  return createTagCommand(`${name} ${version}`.trimEnd(), codeLens);
}