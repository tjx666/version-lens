import {
  DocumentFactory,
  TPackageIdentifier,
  TPackageResponseStatus,
  TPackageDocument,
  PackageVersionTypes,
  PackageSourceTypes
} from 'core.packages';
import { TPackageSuggestion, SuggestionFlags } from 'core.suggestions';

import { NpaSpec } from '../models/npaSpec';

export const fileDependencyRegex = /^file:(.*)$/;

export function createDirectory(
  providerName: string,
  requested: TPackageIdentifier,
  response: TPackageResponseStatus,
  npaSpec: NpaSpec
): TPackageDocument {

  const fileRegExpResult = fileDependencyRegex.exec(requested.version);
  if (!fileRegExpResult) {
    return DocumentFactory.createInvalidVersion(
      providerName,
      requested,
      response,
      <any>npaSpec.type // todo create a converter
    );
  }

  const source = PackageSourceTypes.Directory;
  const type = PackageVersionTypes.Version;

  const resolved = {
    name: npaSpec.name,
    version: fileRegExpResult[1],
  };

  const suggestions: Array<TPackageSuggestion> = [
    {
      name: 'file://',
      version: resolved.version,
      flags: SuggestionFlags.release
    },
  ]

  return {
    providerName,
    source,
    type,
    requested,
    response,
    resolved,
    suggestions
  };
}